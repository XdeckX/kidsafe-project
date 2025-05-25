import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// This function will process the next pending video in the queue for transcription
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the next pending task from the queue
    const { data: task, error: taskError } = await supabase
      .from('ai_queue')
      .select('id, youtube_video_id')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (taskError) {
      if (taskError.code === 'PGRST116') {
        // No pending tasks
        return new Response(
          JSON.stringify({ message: 'No pending tasks' }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      throw taskError;
    }

    // In a real implementation, we would download the video audio and run Whisper here
    // For this implementation, we'll simulate the transcription process

    // Mark the task as being processed
    const { error: updateError } = await supabase
      .from('ai_queue')
      .update({ status: 'processing' })
      .eq('id', task.id);

    if (updateError) throw updateError;

    // Simulate downloading and transcribing the video
    // In a real implementation, this would use yt-dlp and whisper-cpp
    const videoId = task.youtube_video_id;
    
    // Generate a mock transcript
    const mockTranscript = `This is a simulated transcript for video ${videoId}. In a real implementation, 
      we would download the audio using yt-dlp and transcribe it using Whisper. The transcription would
      capture all spoken content from the video for further analysis.`;

    // Upload the transcript to Supabase Storage
    const bucketName = 'transcripts';
    const filePath = `${videoId}.txt`;
    
    // Check if the bucket exists, create if not
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === bucketName)) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['text/plain'],
        fileSizeLimit: 1024 * 1024 * 10, // 10MB
      });
    }
    
    // Upload the transcript
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, mockTranscript, {
        contentType: 'text/plain',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Update the video record with the transcript path
    const { error: videoUpdateError } = await supabase
      .from('videos')
      .update({ transcript_path: `${bucketName}/${filePath}` })
      .eq('youtube_video_id', videoId);

    if (videoUpdateError) throw videoUpdateError;

    // Mark the task as transcribed
    const { error: completeError } = await supabase
      .from('ai_queue')
      .update({ status: 'transcribed' })
      .eq('id', task.id);

    if (completeError) throw completeError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Transcribed video ${videoId}`,
        transcriptPath: `${bucketName}/${filePath}`
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

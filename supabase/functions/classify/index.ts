import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const hfToken = Deno.env.get('HF_TOKEN') || '';
    
    if (!hfToken) {
      throw new Error('Hugging Face token not found');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the next transcribed task from the queue
    const { data: task, error: taskError } = await supabase
      .from('ai_queue')
      .select('id, youtube_video_id')
      .eq('status', 'transcribed')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (taskError) {
      if (taskError.code === 'PGRST116') {
        // No transcribed tasks
        return new Response(
          JSON.stringify({ message: 'No transcribed tasks' }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      throw taskError;
    }

    // Mark the task as being processed
    const { error: updateError } = await supabase
      .from('ai_queue')
      .update({ status: 'classifying' })
      .eq('id', task.id);

    if (updateError) throw updateError;

    // Get the transcript from storage
    const videoId = task.youtube_video_id;
    const bucketName = 'transcripts';
    const filePath = `${videoId}.txt`;
    
    const { data: file, error: fileError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (fileError) throw fileError;
    
    const transcript = await file.text();

    // Prepare the prompt for the LLM
    const prompt = `Strict JSON ONLY:
{ "safe": bool, "loud": 0-10, "age": "all|7+|13+", "junk": 0-10, "reason": str }
Rules: Analyze if this transcript is safe for children. Assess:
- safe: Is it appropriate for children (no violence, profanity, adult themes)?
- loud: How loud/energetic is the content (0=calm, 10=extremely hyper)?
- age: Minimum appropriate age category (all, 7+, 13+)
- junk: How low-quality is the content (0=educational, 10=pure entertainment junk)
- reason: Brief explanation of your rating

Transcript:
${transcript.slice(0, 12000)}`;

    // In a real implementation, this would call the Hugging Face API
    // For this implementation, we'll simulate the response
    // Simulate an LLM classification response
    let verdict = {
      safe: Math.random() > 0.2, // 80% chance of being safe
      loud: Math.floor(Math.random() * 11),
      age: ['all', '7+', '13+'][Math.floor(Math.random() * 3)],
      junk: Math.floor(Math.random() * 11),
      reason: `This is a simulated classification for video ${videoId}.`
    };

    // In a real implementation, we would also get an embedding for the transcript
    // For this implementation, we'll simulate an embedding
    const mockEmbedding = Array(768).fill(0).map(() => (Math.random() * 2) - 1);

    // Update the video with the classification results
    const { error: videoUpdateError } = await supabase
      .from('videos')
      .update({
        safe: verdict.safe,
        loud_score: verdict.loud,
        age_rating: verdict.age,
        junk_score: verdict.junk,
        analysis_notes: verdict.reason,
        embedding: mockEmbedding,
        analyzed_at: new Date().toISOString()
      })
      .eq('youtube_video_id', videoId);

    if (videoUpdateError) throw videoUpdateError;

    // Mark the task as done
    const { error: completeError } = await supabase
      .from('ai_queue')
      .update({ status: 'done' })
      .eq('id', task.id);

    if (completeError) throw completeError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Classified video ${videoId}`,
        verdict
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

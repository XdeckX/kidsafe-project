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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { channelId } = await req.json();

    if (!channelId) {
      return new Response(
        JSON.stringify({ error: 'Channel ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Query YouTube API to get latest videos
    const apiKey = Deno.env.get('YT_API_KEY');
    if (!apiKey) {
      throw new Error('YouTube API key not found');
    }
    
    // Get uploads playlist ID for the channel
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );
    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) {
      throw new Error('Could not find uploads playlist');
    }
    
    // Get videos from the uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${apiKey}`
    );
    const playlistData = await playlistResponse.json();
    
    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId);

    // Add videos to queue
    const queueItems = videoIds.map(id => ({ youtube_video_id: id }));
    
    const { error: queueError } = await supabase
      .from('ai_queue')
      .upsert(queueItems, { onConflict: 'youtube_video_id' });

    if (queueError) throw queueError;

    // Also insert basic video information into videos table
    const videoItems = playlistData.items.map((item: any) => ({
      youtube_video_id: item.contentDetails.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      channel_id: channelId,
      published_at: item.snippet.publishedAt,
    }));

    const { error: videosError } = await supabase
      .from('videos')
      .upsert(videoItems, { onConflict: 'youtube_video_id' });

    if (videosError) throw videosError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Added ${videoIds.length} videos to processing queue` 
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

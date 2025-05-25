export async function youtubeLatest(channelId: string, limit: number = 10): Promise<string[]> {
  const apiKey = process.env.YT_API_KEY;
  if (!apiKey) throw new Error('YouTube API key not found');
  
  // Get uploads playlist ID for the channel
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
  );
  const channelData = await channelResponse.json();
  const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
  
  if (!uploadsPlaylistId) throw new Error('Could not find uploads playlist');
  
  // Get videos from the uploads playlist
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${limit}&key=${apiKey}`
  );
  const playlistData = await playlistResponse.json();
  
  return playlistData.items.map((item: any) => item.contentDetails.videoId);
}

import * as React from 'react';
import { createClient } from '@supabase/supabase-js';

// Define the type for safe videos that will work with both local storage and future Supabase integration
export interface SafeVideo {
  id: string;
  youtube_video_id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel_id: string;
  channelName?: string;
  category?: string;
  categoryIds?: string[];
  views: string;
  published_at: string;
  publishedAt?: string;
  safe: boolean;
  age_rating: string;
  loud_score: number;
  junk_score: number;
  childIds: string[];
}

// Initialize Supabase client - will use environment variables when deployed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Type definition for the return value of the useSafeVideos hook
 */
export interface SafeVideosResult {
  videos: SafeVideo[];
  loading: boolean;
  error: Error | null;
  filterByApprovedChannels: (approvedChannelIds: string[]) => SafeVideo[];
}

/**
 * Function to generate mock video data
 * This is kept outside the React component to avoid recreation on renders
 */
function generateMockData(childId: string): SafeVideo[] {
  const categories = ['education', 'entertainment', 'music', 'animals', 'science'];
  const channels = [
    { id: 'UC-channel1', name: 'Kids Learning Channel' },
    { id: 'UC-channel2', name: 'Fun Science Experiments' },
    { id: 'UC-channel3', name: 'Animal Adventures' },
    { id: 'UC-channel4', name: 'Storytelling For Kids' },
    { id: 'UC-channel5', name: 'Music For Children' }
  ];
  
  const result: SafeVideo[] = [];
  
  for (let i = 0; i < 15; i++) {
    const channelIndex = i % channels.length;
    const categoryIndex = i % categories.length;
    const isSafe = i < 12; // Make 12 of 15 videos safe
    const videoId = `video-${i + 1}`;
    
    // Get channel and category safely
    const channel = channels[channelIndex]!;
    const category = categories[categoryIndex]!;
    
    // Create a video object with all required properties
    result.push({
      id: videoId,
      youtube_video_id: `ytid-${videoId}`,
      title: `Kid-friendly video ${i + 1} about ${category}`,
      thumbnail: `https://img.youtube.com/vi/mock-${videoId}/maxresdefault.jpg`,
      duration: `${Math.floor(Math.random() * 10) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      channel_id: channel.id,
      channelName: channel.name,
      category: category,
      categoryIds: [category],
      views: `${Math.floor(Math.random() * 100000)} views`,
      published_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      safe: isSafe,
      age_rating: isSafe ? 'all' : Math.random() > 0.5 ? '7+' : '13+',
      loud_score: Math.floor(Math.random() * 10),
      junk_score: isSafe ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 7) + 3,
      childIds: [childId]
    });
  }
  
  return result;
}

/**
 * Custom hook to fetch safe videos for a specific child profile
 * This follows the frontend-first approach initially using localStorage
 * but with the structure ready for Supabase integration later
 */
export function useSafeVideos(childId: string): SafeVideosResult {
  // Use React.useState to avoid any import issues
  const [videos, setVideos] = React.useState<SafeVideo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [useLocalStorage, setUseLocalStorage] = React.useState<boolean>(false);
  
  // Safe localStorage helper to handle SSR and errors
  const safeStorage = React.useMemo(() => {
    return {
      getItem: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
          return localStorage.getItem(key);
        } catch (e) {
          console.error('Error accessing localStorage:', e);
          return null;
        }
      },
      setItem: (key: string, value: string): void => {
        if (typeof window === 'undefined') return;
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.error('Error writing to localStorage:', e);
        }
      }
    };
  }, []);

  // Fetch videos on component mount and when childId changes
  React.useEffect(() => {
    let isMounted = true;
    
    const fetchVideos = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        // Try to get videos from Supabase first
        try {
          // Get approved channels for this child
          const { data: approvedChannels, error: channelsError } = await supabase
            .from('child_approved_channels')
            .select('channel_id')
            .eq('child_id', childId);
          
          if (channelsError) throw channelsError;
          
          // Get videos from approved channels
          if (approvedChannels && approvedChannels.length > 0) {
            const channelIds = approvedChannels.map(c => c.channel_id);
            
            const { data: videosData, error: videosError } = await supabase
              .from('videos')
              .select('*')
              .in('channel_id', channelIds);
              
            if (videosError) throw videosError;
            
            if (videosData && videosData.length > 0) {
              // Transform database videos to SafeVideo format
              const safeVideos: SafeVideo[] = videosData.map(v => ({
                id: v.id.toString(),
                youtube_video_id: v.youtube_video_id,
                title: v.title,
                thumbnail: v.thumbnail || '',
                duration: v.duration || '0:00',
                channel_id: v.channel_id,
                channelName: v.channel_name || '',
                category: v.category || '',
                categoryIds: v.category ? [v.category] : [],
                views: v.views || '0 views',
                published_at: v.published_at || new Date().toISOString(),
                publishedAt: v.published_at || new Date().toISOString(),
                safe: true, // We only store safe videos in the database
                age_rating: 'all',
                loud_score: 0,
                junk_score: 0,
                childIds: [childId]
              }));
              
              setVideos(safeVideos);
              setUseLocalStorage(false);
              setLoading(false);
              return;
            }
          }
        } catch (supabaseErr) {
          console.warn('Supabase error, falling back to localStorage:', supabaseErr);
          setUseLocalStorage(true);
        }
        
        // Fallback to localStorage
        const storageKey = `kidsafe_videos_${childId}`;
        const storedVideos = safeStorage.getItem(storageKey);
        
        if (!isMounted) return;
        
        if (storedVideos) {
          // Use stored videos if available
          try {
            const parsedVideos = JSON.parse(storedVideos) as SafeVideo[];
            setVideos(parsedVideos.filter(v => v.safe === true));
          } catch (parseError) {
            console.error('Error parsing stored videos:', parseError);
            // If parse fails, generate new ones
            const newMockVideos = generateMockData(childId);
            safeStorage.setItem(storageKey, JSON.stringify(newMockVideos));
            setVideos(newMockVideos.filter(v => v.safe === true));
          }
        } else {
          // Generate mock videos if none exist
          const newMockVideos = generateMockData(childId);
          safeStorage.setItem(storageKey, JSON.stringify(newMockVideos));
          setVideos(newMockVideos.filter(v => v.safe === true));
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching videos:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Execute the fetch function
    fetchVideos();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [childId, safeStorage]);
  
  // Add periodic video updates (simulates real-time)  
  React.useEffect(() => {
    let isMounted = true;
    
    // Set up a simple interval to add new videos periodically
    const interval = setInterval(() => {
      if (!isMounted) return;
      
      // Don't add too many videos
      if (videos.length >= 30) return;
      
      // Create a new mock video
      const newMockVideo = generateMockData(childId)[0];
      
      // Only add safe videos
      if (newMockVideo && newMockVideo.safe) {
        setVideos(prevVideos => {
          // Only add if it doesn't already exist
          if (!prevVideos.some(v => v.youtube_video_id === newMockVideo.youtube_video_id)) {
            const updatedVideos = [newMockVideo, ...prevVideos];
            
            // Update localStorage (safely)
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(
                  `kidsafe_videos_${childId}`, 
                  JSON.stringify(updatedVideos)
                );
              } catch (e) {
                console.error('Error updating localStorage:', e);
              }
            }
            
            return updatedVideos;
          }
          return prevVideos;
        });
      }
    }, 30000); // Add a new video every 30 seconds
    
    // Clean up interval on unmount
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [childId, videos.length]);

  // Helper function to filter videos by approved channels
  const filterByApprovedChannels = React.useCallback(
    (approvedChannelIds: string[]): SafeVideo[] => {
      if (!approvedChannelIds || approvedChannelIds.length === 0) return videos;
      return videos.filter(video => approvedChannelIds.includes(video.channel_id));
    },
    [videos]
  );
  
  // Return the hook's API with explicit typing
  return {
    videos,
    loading,
    error,
    filterByApprovedChannels
  };
}

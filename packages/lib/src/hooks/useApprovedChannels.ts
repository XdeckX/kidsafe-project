import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface Channel {
  id: string;
  channel_id: string;
  name: string;
  thumbnail: string;
  description?: string;
  subscriber_count?: string;
  video_count?: string;
  safe?: boolean;
}

export interface ApprovedChannel {
  id: string;
  child_id: string;
  channel_id: string;
  approved_at: string;
  channel?: Channel;
}

// Initialize Supabase client - will use environment variables when deployed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Custom hook to manage approved channels for a specific child
 * Uses Supabase for data persistence with localStorage fallback
 */
export const useApprovedChannels = (childId: string) => {
  const [approvedChannels, setApprovedChannels] = useState<ApprovedChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Generate mock channel data
  const generateMockChannels = (): Channel[] => {
    const channels = [
      { 
        id: '1', 
        channel_id: 'UC-channel1', 
        name: 'Kids Learning Channel',
        thumbnail: 'https://picsum.photos/seed/channel1/200',
        description: 'Educational content for kids ages 3-10',
        subscriber_count: '2.5M',
        video_count: '450',
        safe: true
      },
      { 
        id: '2', 
        channel_id: 'UC-channel2', 
        name: 'Fun Science Experiments',
        thumbnail: 'https://picsum.photos/seed/channel2/200',
        description: 'Science experiments and explanations for kids',
        subscriber_count: '1.8M',
        video_count: '320',
        safe: true
      },
      { 
        id: '3', 
        channel_id: 'UC-channel3', 
        name: 'Animal Adventures',
        thumbnail: 'https://picsum.photos/seed/channel3/200',
        description: 'Learn about animals from around the world',
        subscriber_count: '3.2M',
        video_count: '520',
        safe: true
      },
      { 
        id: '4', 
        channel_id: 'UC-channel4', 
        name: 'Storytelling For Kids',
        thumbnail: 'https://picsum.photos/seed/channel4/200',
        description: 'Engaging stories for children of all ages',
        subscriber_count: '1.4M',
        video_count: '280',
        safe: true
      },
      { 
        id: '5', 
        channel_id: 'UC-channel5', 
        name: 'Music For Children',
        thumbnail: 'https://picsum.photos/seed/channel5/200',
        description: 'Kid-friendly music and songs',
        subscriber_count: '2.1M',
        video_count: '390',
        safe: true
      },
      { 
        id: '6', 
        channel_id: 'UC-channel6', 
        name: 'DIY Crafts for Kids',
        thumbnail: 'https://picsum.photos/seed/channel6/200',
        description: 'Arts and crafts tutorials for children',
        subscriber_count: '980K',
        video_count: '215',
        safe: true
      },
      { 
        id: '7', 
        channel_id: 'UC-channel7', 
        name: 'Math Made Fun',
        thumbnail: 'https://picsum.photos/seed/channel7/200',
        description: 'Making mathematics enjoyable for young minds',
        subscriber_count: '1.2M',
        video_count: '250',
        safe: true
      }
    ];
    
    return channels;
  };

  // Fetch approved channels on component mount
  useEffect(() => {
    const fetchApprovedChannels = async () => {
      try {
        setLoading(true);
        
        // Check if we should use Supabase or localStorage
        const useSupabase = localStorage.getItem('kidsafe_use_supabase') === 'true';
        
        if (useSupabase) {
          // Try Supabase first
          try {
            const { data: approvedData, error: supabaseError } = await supabase
              .from('child_approved_channels')
              .select('id, child_id, channel_id, created_at')
              .eq('child_id', childId);
            
            if (supabaseError) throw supabaseError;
            
            if (approvedData && approvedData.length > 0) {
              // We have data from Supabase
              const formattedData: ApprovedChannel[] = approvedData.map(item => ({
                id: item.id.toString(),
                child_id: item.child_id,
                channel_id: item.channel_id,
                approved_at: item.created_at
              }));
              
              // Get channel details for each approved channel
              const channelsWithDetails = await Promise.all(
                formattedData.map(async (approved) => {
                  // In a real app, you'd fetch this from a channels table
                  // For now, let's use our mock data
                  const mockChannels = generateMockChannels();
                  const matchingChannel = mockChannels.find(c => c.channel_id === approved.channel_id);
                  
                  return {
                    ...approved,
                    channel: matchingChannel
                  };
                })
              );
              
              setApprovedChannels(channelsWithDetails);
              setUseLocalStorage(false);
              return;
            }
          } catch (supabaseErr) {
            console.warn('Supabase error, falling back to localStorage:', supabaseErr);
            setUseLocalStorage(true);
          }
        }
        
        // Fallback to localStorage if Supabase fails or returns no data
        const storageKey = `kidsafe_approved_channels_${childId}`;
        const storedChannels = localStorage.getItem(storageKey);
        
        if (storedChannels) {
          setApprovedChannels(JSON.parse(storedChannels));
        } else {
          // Generate mock data for initial state
          const mockChannels = generateMockChannels();
          const initialApproved: ApprovedChannel[] = mockChannels.slice(0, 3).map(channel => ({
            id: `approved-${channel.id}`,
            child_id: childId,
            channel_id: channel.channel_id,
            approved_at: new Date().toISOString(),
            channel: channel
          }));
          
          localStorage.setItem(storageKey, JSON.stringify(initialApproved));
          setApprovedChannels(initialApproved);
        }
      } catch (err) {
        console.error('Error fetching approved channels:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovedChannels();
  }, [childId]);

  // Function to approve a new channel
  const approveChannel = async (channel: Channel) => {
    try {
      // Check if channel is already approved
      if (approvedChannels.some(approved => approved.channel_id === channel.channel_id)) {
        return; // Already approved
      }
      
      let newApproved: ApprovedChannel;
      
      if (!useLocalStorage) {
        // Use Supabase
        const { data, error } = await supabase
          .from('child_approved_channels')
          .insert({
            child_id: childId,
            channel_id: channel.channel_id
          })
          .select()
          .single();
        
        if (error) throw error;
        
        newApproved = {
          id: data.id.toString(),
          child_id: data.child_id,
          channel_id: data.channel_id,
          approved_at: data.created_at,
          channel: channel
        };
      } else {
        // Fallback to localStorage
        newApproved = {
          id: `approved-${Date.now()}`,
          child_id: childId,
          channel_id: channel.channel_id,
          approved_at: new Date().toISOString(),
          channel: channel
        };
        
        // Update localStorage
        const storageKey = `kidsafe_approved_channels_${childId}`;
        const updatedChannels = [...approvedChannels, newApproved];
        localStorage.setItem(storageKey, JSON.stringify(updatedChannels));
      }
      
      // Update state
      setApprovedChannels(prev => [...prev, newApproved]);
    } catch (err) {
      console.error('Error approving channel:', err);
      throw err;
    }
  };

  // Function to remove an approved channel
  const removeChannel = async (channelId: string) => {
    try {
      if (!useLocalStorage) {
        // Use Supabase
        const { error } = await supabase
          .from('child_approved_channels')
          .delete()
          .eq('child_id', childId)
          .eq('channel_id', channelId);
        
        if (error) throw error;
      } else {
        // Fallback to localStorage
        const storageKey = `kidsafe_approved_channels_${childId}`;
        const updatedChannels = approvedChannels.filter(
          approved => approved.channel_id !== channelId
        );
        localStorage.setItem(storageKey, JSON.stringify(updatedChannels));
      }
      
      // Update state regardless of storage method
      setApprovedChannels(prev => 
        prev.filter(approved => approved.channel_id !== channelId)
      );
    } catch (err) {
      console.error('Error removing approved channel:', err);
      
      // Fix TypeScript error by ensuring we have the right type
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(String(err)));
      }
      
      return false;
    }
  };

  // Function to get all available channels (for selection)
  const getAvailableChannels = (): Channel[] => {
    const mockChannels = generateMockChannels();
    const approvedChannelIds = approvedChannels.map(ac => ac.channel_id);
    
    // Filter out already approved channels
    return mockChannels.filter(channel => !approvedChannelIds.includes(channel.channel_id));
  };

  return {
    approvedChannels,
    loading,
    error,
    approveChannel,
    removeChannel,
    getAvailableChannels
  };
};

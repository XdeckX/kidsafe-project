"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { type ChildProfile, type Channel } from "@repo/lib/src/types";

// Mock data storage keys
const CHILD_PROFILES_KEY = "kidsafe_child_profiles";
const CHANNELS_KEY = "kidsafe_channels";

// YouTube channel ID extraction regex patterns
const CHANNEL_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)/, // youtube.com/channel/UCxxxxxx
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([a-zA-Z0-9_-]+)/, // youtube.com/c/ChannelName
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([a-zA-Z0-9_-]+)/, // youtube.com/user/UserName
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_-]+)/, // youtube.com/@HandleName
];

export default function ChannelManagementPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [newChannelUrl, setNewChannelUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load child profile and their channels
  useEffect(() => {
    const loadData = () => {
      try {
        // Load child profile
        const profilesData = localStorage.getItem(CHILD_PROFILES_KEY);
        if (profilesData) {
          const profiles: ChildProfile[] = JSON.parse(profilesData);
          const childProfile = profiles.find(p => p.id === childId);
          if (childProfile) {
            setChild(childProfile);
          } else {
            // Child not found, redirect to dashboard
            router.push("/parent/dashboard");
            return;
          }
        }
        
        // Load channels
        const channelsData = localStorage.getItem(CHANNELS_KEY);
        if (channelsData) {
          const allChannels: Channel[] = JSON.parse(channelsData);
          const childChannels = allChannels.filter(c => c.child_id === childId);
          setChannels(childChannels);
        }
      } catch (error) {
        console.error("Failed to load data", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [childId, router]);

  // Save channels to localStorage
  const saveChannels = (updatedChannels: Channel[]) => {
    try {
      // Get all channels
      const channelsData = localStorage.getItem(CHANNELS_KEY);
      let allChannels: Channel[] = channelsData ? JSON.parse(channelsData) : [];
      
      // Remove current child's channels and add the updated ones
      allChannels = allChannels.filter(c => c.child_id !== childId);
      allChannels = [...allChannels, ...updatedChannels];
      
      // Save back to localStorage
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(allChannels));
    } catch (error) {
      console.error("Failed to save channels", error);
      setError("Failed to save changes. Please try again.");
    }
  };

  // Extract channel ID and other info from a YouTube URL
  const extractChannelInfo = async (url: string): Promise<{ id: string; name: string; thumbnail?: string } | null> => {
    // For a real implementation, we would use the YouTube API here
    // Since we're doing frontend-only development, we'll mock this process
    
    // Try to extract channel ID using regex patterns
    let channelId = "";
    let channelHandle = "";
    
    for (const pattern of CHANNEL_PATTERNS) {
      const match = url.match(pattern);
      if (match && match[1]) {
        if (pattern.toString().includes("channel")) {
          channelId = match[1];
          break;
        } else {
          // Handle, username or custom URL
          channelHandle = match[1];
          // In a real implementation, we'd convert this to a channel ID via the API
          // For now, we'll use it as is
          channelId = `mock_id_${channelHandle}`;
          break;
        }
      }
    }
    
    // If no match found, check if they just entered a channel ID directly
    if (!channelId && /^[a-zA-Z0-9_-]{24}$/.test(url.trim())) {
      channelId = url.trim();
    }
    
    // If we still don't have a channel ID, use a mock one for demo purposes
    if (!channelId) {
      channelId = `mock_id_${Date.now()}`;
    }
    
    // Generate a mock name based on the URL or input
    const urlParts = url ? url.split(/[@/]/) : [];
    // Add safety check to avoid undefined access
    let lastPart = '';
    if (urlParts.length > 0) {
      const lastPartRaw = urlParts[urlParts.length - 1];
      if (lastPartRaw) {
        lastPart = lastPartRaw.replace(/[^a-zA-Z0-9]/g, '');
      }
    }
    const mockName = lastPart || `Channel ${channels.length + 1}`;
    
    return {
      id: channelId,
      name: mockName,
      thumbnail: `https://via.placeholder.com/120x120.png?text=${mockName.charAt(0).toUpperCase()}`
    };
  };

  // Handle adding a new channel
  const handleAddChannel = async () => {
    if (!newChannelUrl.trim()) {
      setError("Please enter a YouTube channel URL");
      return;
    }
    
    setIsAdding(true);
    setError(null);
    
    try {
      // Extract channel info
      const channelInfo = await extractChannelInfo(newChannelUrl.trim());
      
      if (!channelInfo) {
        setError("Invalid YouTube channel URL. Please try again.");
        return;
      }
      
      // Check if channel already exists for this child
      if (channels.some(c => c.channel_id === channelInfo.id)) {
        setError("This channel is already in your whitelist");
        return;
      }
      
      // Create new channel
      const newChannel: Channel = {
        id: `channel_${Date.now()}`,
        child_id: childId,
        channel_id: channelInfo.id,
        channel_name: channelInfo.name,
        thumbnail_url: channelInfo.thumbnail,
        created_at: new Date().toISOString()
      };
      
      // Update state and save
      const updatedChannels = [...channels, newChannel];
      setChannels(updatedChannels);
      saveChannels(updatedChannels);
      
      // Clear input
      setNewChannelUrl("");
      
      // Mock the "importing videos" process
      setTimeout(() => {
        alert("Channel added! Videos from this channel are now being analyzed.");
      }, 500);
    } catch (error) {
      console.error("Failed to add channel", error);
      setError("Failed to add channel. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // Handle removing a channel
  const handleRemoveChannel = (channelId: string) => {
    if (confirm("Are you sure you want to remove this channel? All videos from this channel will be inaccessible to the child.")) {
      const updatedChannels = channels.filter(c => c.id !== channelId);
      setChannels(updatedChannels);
      saveChannels(updatedChannels);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Child profile not found</h1>
          <Link href="/parent/dashboard">
            <Button variant="kid">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-kidsafe-lightBg">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-kidsafe-violet">KidSafe YouTube</h1>
          <Link href="/parent/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold mr-3"
              style={{ backgroundColor: child.avatar_color || '#6C63FF' }}
            >
              {child.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-bold">{child.name}'s Channels</h2>
          </div>
          <p className="text-gray-600">
            Manage the YouTube channels that {child.name} is allowed to watch
          </p>
        </div>

        {/* Add Channel Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add a YouTube Channel</CardTitle>
            <CardDescription>
              Enter a YouTube channel URL, handle (@username), or channel ID to whitelist it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={newChannelUrl}
                onChange={(e) => setNewChannelUrl(e.target.value)}
                placeholder="e.g., https://www.youtube.com/@peppa_pig or @peppa_pig"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <Button 
                onClick={handleAddChannel} 
                variant="kid" 
                disabled={isAdding || !newChannelUrl.trim()}
              >
                {isAdding ? "Adding..." : "Add Channel"}
              </Button>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Channels List */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Whitelisted Channels</h3>
          
          {channels.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-xl text-gray-600 mb-4">No channels have been added yet.</p>
              <p className="text-gray-500">
                Add your first channel above to get started. Once added, videos from that channel will be analyzed and available in Kid Mode.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      {channel.thumbnail_url ? (
                        <img 
                          src={channel.thumbnail_url} 
                          alt={channel.channel_name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          {channel.channel_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg">{channel.channel_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500">
                      Added: {new Date(channel.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => handleRemoveChannel(channel.id)}
                      className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      Remove
                    </Button>
                    <Button variant="secondary">
                      View Videos
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

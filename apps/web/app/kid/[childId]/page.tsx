"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
// Custom type definitions to match Supabase schema
interface ChildProfile {
  id: string;
  name: string;
  avatar_color?: string;
  parent_id: string;
  pin?: string;
  created_at?: string;
}

interface Channel {
  id: string;
  channel_id: string;
  channel_name: string;
  thumbnail_url?: string;
  description?: string;
  subscriber_count?: string;
  video_count?: string;
  safe?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Mock data storage keys
const CHILD_PROFILES_KEY = "kidsafe_child_profiles";
const CHANNELS_KEY = "kidsafe_channels";

export default function KidModePage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load child profile from localStorage
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(CHILD_PROFILES_KEY);
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        const foundChild = profiles.find((p: ChildProfile) => p.id === childId);
        
        if (foundChild) {
          setChild(foundChild);
        } else {
          // Child not found, redirect to parent dashboard
          router.push("/parent/dashboard");
        }
      }
      
      // Load approved channels for this child
      const storedChannels = localStorage.getItem(CHANNELS_KEY);
      if (storedChannels) {
        const allChannels = JSON.parse(storedChannels);
        // Filter channels that are approved for this child
        // For demo purposes, we're showing all channels for now
        setChannels(allChannels || []);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load child profile:", error);
      setIsLoading(false);
    }
  }, [childId, router]);

  // Mock data for channels if none exist
  useEffect(() => {
    if (!isLoading && channels.length === 0) {
      // For demo purposes, create mock data if no channels exist
      const mockChannels = [
        {
          id: "ch1",
          channel_id: "ch1",
          channel_name: "Kids Learning Channel",
          thumbnail_url: "https://i.ytimg.com/vi/channel1/mqdefault.jpg",
          subscriber_count: "2.1M",
          video_count: "450",
          safe: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "ch2",
          channel_id: "ch2",
          channel_name: "Cartoon World",
          thumbnail_url: "https://i.ytimg.com/vi/channel2/mqdefault.jpg",
          subscriber_count: "3.5M",
          video_count: "320",
          safe: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "ch3",
          channel_id: "ch3",
          channel_name: "Science for Kids",
          thumbnail_url: "https://i.ytimg.com/vi/channel3/mqdefault.jpg",
          subscriber_count: "1.2M",
          video_count: "180",
          safe: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "ch4",
          channel_id: "ch4",
          channel_name: "Story Time",
          thumbnail_url: "https://i.ytimg.com/vi/channel4/mqdefault.jpg",
          subscriber_count: "850K",
          video_count: "120",
          safe: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "ch5",
          channel_id: "ch5",
          channel_name: "Music for Kids",
          thumbnail_url: "https://i.ytimg.com/vi/channel5/mqdefault.jpg",
          subscriber_count: "1.8M",
          video_count: "280",
          safe: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "ch6",
          channel_id: "ch6",
          channel_name: "Art & Crafts Club",
          thumbnail_url: "https://i.ytimg.com/vi/channel6/mqdefault.jpg",
          subscriber_count: "980K",
          video_count: "210",
          safe: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setChannels(mockChannels);
      // Save to localStorage for demo purposes
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(mockChannels));
    }
  }, [childId, channels.length, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-bounce">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find this child profile.</p>
          <Link href="/parent/dashboard">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/parent/dashboard" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ backgroundColor: child.avatar_color || '#6C63FF' }}
              >
                {child.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  {child.name}'s Videos
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Parent Preview Mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Approved Channels
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map(channel => (
              <Link href={`/kid/${childId}/channel/${channel.id}`} key={channel.id}>
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {channel.thumbnail_url ? (
                          <img 
                            src={channel.thumbnail_url} 
                            alt={channel.channel_name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {channel.channel_name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {channel.subscriber_count} subscribers
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {channel.video_count} approved videos
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

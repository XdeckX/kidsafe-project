"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import { Card } from "../../../../../components/ui/card";
import { type ChildProfile, type Channel, type Video } from "@repo/lib/src/types";

// Mock data storage keys
const CHILD_PROFILES_KEY = "kidsafe_child_profiles";
const CHANNELS_KEY = "kidsafe_channels";
const VIDEOS_KEY = "kidsafe_videos";

// Mock video thumbnails and titles for demo purposes
const mockVideoData = [
  {
    id: "v1",
    title: "Learning Colors with Animals",
    thumbnail: "https://i.ytimg.com/vi/videoid1/mqdefault.jpg",
    duration: "4:32",
    category: "educational",
    channelId: "ch1",
    views: "1.2M",
    publishedAt: "2023-10-15"
  },
  {
    id: "v2",
    title: "ABC Song | Phonics Song",
    thumbnail: "https://i.ytimg.com/vi/videoid2/mqdefault.jpg",
    duration: "3:15",
    category: "educational",
    channelId: "ch1",
    views: "2.4M",
    publishedAt: "2023-09-20"
  },
  {
    id: "v3",
    title: "The Adventures of Teddy Bear - Episode 1",
    thumbnail: "https://i.ytimg.com/vi/videoid3/mqdefault.jpg",
    duration: "11:24",
    category: "cartoons",
    channelId: "ch2",
    views: "876K",
    publishedAt: "2023-11-05"
  },
  {
    id: "v4",
    title: "How Plants Grow - Science for Kids",
    thumbnail: "https://i.ytimg.com/vi/videoid4/mqdefault.jpg",
    duration: "7:42",
    category: "educational",
    channelId: "ch3",
    views: "543K",
    publishedAt: "2023-08-12"
  },
  {
    id: "v5",
    title: "Baby Shark Dance | Kids Songs",
    thumbnail: "https://i.ytimg.com/vi/videoid5/mqdefault.jpg",
    duration: "2:16",
    category: "music",
    channelId: "ch5",
    views: "10.5M",
    publishedAt: "2023-07-30"
  },
  {
    id: "v6",
    title: "DIY Slime Recipe - Easy Craft for Kids",
    thumbnail: "https://i.ytimg.com/vi/videoid6/mqdefault.jpg",
    duration: "8:53",
    category: "crafts",
    channelId: "ch6",
    views: "1.8M",
    publishedAt: "2023-10-28"
  }
];

export default function ChannelVideosPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const channelId = params.channelId as string;
  
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    try {
      // Load child profile
      const storedProfiles = localStorage.getItem(CHILD_PROFILES_KEY);
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        const foundChild = profiles.find((p: ChildProfile) => p.id === childId);
        
        if (foundChild) {
          setChild(foundChild);
        } else {
          // Child not found, redirect to parent dashboard
          router.push("/parent/dashboard");
          return;
        }
      }
      
      // Load channel information
      const storedChannels = localStorage.getItem(CHANNELS_KEY);
      if (storedChannels) {
        const allChannels = JSON.parse(storedChannels);
        const foundChannel = allChannels.find((c: Channel) => c.id === channelId);
        
        if (foundChannel) {
          setChannel(foundChannel);
        } else {
          // Channel not found, redirect to child's page
          router.push(`/kid/${childId}`);
          return;
        }
      }
      
      // Load videos for this channel
      // For demo purposes, we'll create mock videos if none exist
      const storedVideos = localStorage.getItem(VIDEOS_KEY);
      if (storedVideos) {
        const allVideos = JSON.parse(storedVideos);
        // Filter videos for this channel
        const channelVideos = allVideos.filter((v: Video) => v.channelId === channelId);
        setVideos(channelVideos);
      } else {
        // Create mock videos for the demo
        const channelVideos = mockVideoData.filter(v => v.channelId === channelId);
        setVideos(channelVideos);
        
        // Save to localStorage for demo purposes
        localStorage.setItem(VIDEOS_KEY, JSON.stringify(mockVideoData));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load data:", error);
      setIsLoading(false);
    }
  }, [childId, channelId, router]);

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

  if (!child || !channel) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find this channel or child profile.</p>
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
            <Link href={`/kid/${childId}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
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
                  {channel.name}
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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {channel.thumbnail ? (
                <img 
                  src={channel.thumbnail} 
                  alt={channel.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {channel.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {channel.subscriberCount} subscribers • {channel.videoCount} videos
              </p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Approved Videos
          </h3>
          
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <Link href={`/kid/${childId}/watch/${video.id}`} key={video.id}>
                  <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800">
                    <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <span>{video.views} views</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                No videos found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                There are no approved videos for this channel yet
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

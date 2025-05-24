"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";
import { type ChildProfile, type Video } from "@repo/lib/src/types";

// Mock data storage keys
const CHILD_PROFILES_KEY = "kidsafe_child_profiles";
const VIDEOS_KEY = "kidsafe_videos";
const WATCH_HISTORY_KEY = "kidsafe_watch_history";

export default function WatchVideoPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const videoId = params.videoId as string;
  
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
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
      
      // Load video information
      const storedVideos = localStorage.getItem(VIDEOS_KEY);
      if (storedVideos) {
        const allVideos = JSON.parse(storedVideos);
        const foundVideo = allVideos.find((v: Video) => v.id === videoId);
        
        if (foundVideo) {
          setVideo(foundVideo);
          
          // Find related videos (same category or channel)
          const related = allVideos.filter((v: Video) => 
            v.id !== videoId && 
            (v.category === foundVideo.category || v.channelId === foundVideo.channelId)
          ).slice(0, 4);
          setRelatedVideos(related);
          
          // Log video watch in history
          logVideoWatch(childId, foundVideo.id);
        } else {
          // Video not found, redirect to child's page
          router.push(`/kid/${childId}`);
          return;
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load data:", error);
      setIsLoading(false);
    }
  }, [childId, videoId, router]);

  // Log video watch for analytics
  const logVideoWatch = (childId: string, videoId: string) => {
    try {
      const watchHistory = JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || "[]");
      
      watchHistory.push({
        childId,
        videoId,
        startTime: new Date().toISOString(),
        duration: 0  // In a real app, we'd track end time when the video completes
      });
      
      localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(watchHistory));
    } catch (error) {
      console.error("Failed to log video watch:", error);
    }
  };

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

  if (!child || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">We couldn't find this video or child profile.</p>
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href={`/kid/${childId}/channel/${video.channelId}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
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
                  Now Watching
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
        {/* Video player */}
        <div className="mb-8">
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white text-lg">This is a preview. Video would play here in the actual kid mode.</p>
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {video.title}
          </h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>{video.views} views</span>
              <span>•</span>
              <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Favorites
              </Button>
            </div>
          </div>
          
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Channel Name
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This video is appropriate for {child.name} and matches their interests
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related videos */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            More Videos Like This
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedVideos.map(relatedVideo => (
              <Link href={`/kid/${childId}/watch/${relatedVideo.id}`} key={relatedVideo.id} className="group">
                <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
                  <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {relatedVideo.thumbnail ? (
                        <img 
                          src={relatedVideo.thumbnail} 
                          alt={relatedVideo.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {relatedVideo.duration}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                      {relatedVideo.title}
                    </h4>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {relatedVideo.views} views
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

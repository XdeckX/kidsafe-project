"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSafeVideos, SafeVideo, SafeVideosResult } from "@repo/lib/src/hooks/useSafeVideos";

// Types
type KidProfile = {
  id: string;
  name: string;
  avatar_color: string;
  pin?: string;
  age?: number;
};

type VideoCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

// Mock data for the frontend-first approach
const MOCK_CATEGORIES: VideoCategory[] = [
  { id: "cat1", name: "Cartoons", icon: "🎬", color: "bg-blue-100 dark:bg-blue-900/30" },
  { id: "cat2", name: "Educational", icon: "🧠", color: "bg-green-100 dark:bg-green-900/30" },
  { id: "cat3", name: "Music", icon: "🎵", color: "bg-pink-100 dark:bg-pink-900/30" },
  { id: "cat4", name: "Science", icon: "🔬", color: "bg-purple-100 dark:bg-purple-900/30" },
  { id: "cat5", name: "Arts & Crafts", icon: "🎨", color: "bg-yellow-100 dark:bg-yellow-900/30" },
  { id: "cat6", name: "Animals", icon: "🐾", color: "bg-orange-100 dark:bg-orange-900/30" }
];

export default function KidDashboard() {
  const router = useRouter();
  const [activeProfile, setActiveProfile] = useState<KidProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Always call hooks at the top level, not conditionally
  // Use a default ID when no active profile exists
  const safeVideosResult: SafeVideosResult = useSafeVideos(activeProfile?.id || 'placeholder');
  
  // Only use videos when we have an active profile
  const safeVideos = activeProfile ? safeVideosResult.videos : [];
  const videosLoading = safeVideosResult.loading;
    
  // Filter videos by selected category
  const filteredVideos = selectedCategory
    ? safeVideos.filter((video: SafeVideo) => {
        // Check if the video has category information
        if (video.categoryIds) {
          return video.categoryIds.includes(selectedCategory);
        } else if (video.category) {
          // For the backend data structure
          return video.category === selectedCategory;
        }
        return false;
      })
    : safeVideos;

  useEffect(() => {
    // Check for active kid profile
    const checkProfile = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedProfile = localStorage.getItem("kidsafe_active_kid");
          
          if (!storedProfile) {
            // Redirect to kid login if no active profile
            router.push("/kid/login");
            return;
          }
          
          setActiveProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error("Failed to parse active kid profile:", error);
        router.push("/kid/login");
      }
    };
    
    checkProfile();
    
    // Simulate loading delay for frontend-first approach
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [router]);

  // Mock function to log video watch for analytics
  const logVideoWatch = (videoId: string) => {
    try {
      if (typeof window !== 'undefined') {
        const watchHistory = JSON.parse(localStorage.getItem("kidsafe_watch_history") || "[]");
        
        watchHistory.push({
          childId: activeProfile?.id,
          videoId,
          startTime: new Date().toISOString(),
          // In a real app, we'd track end time when the video completes
          duration: 0
        });
        
        localStorage.setItem("kidsafe_watch_history", JSON.stringify(watchHistory));
      }
    } catch (error) {
      console.error("Failed to log video watch:", error);
    }
  };

  const handleExit = () => {
    // Clear active kid profile
    if (typeof window !== 'undefined') {
      localStorage.removeItem("kidsafe_active_kid");
    }
    router.push("/kid/login");
  };

  if (isLoading || !activeProfile || videosLoading) {
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

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
              style={{ backgroundColor: activeProfile.avatar_color }}
            >
              {activeProfile.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Hi, {activeProfile.name}!
            </h1>
          </div>
          
          <button 
            onClick={() => setShowExitModal(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Categories
          </h2>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 py-2 px-4 rounded-full font-medium ${
                selectedCategory === null
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              } transition-colors`}
            >
              All
            </button>
            
            {MOCK_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`shrink-0 py-2 px-4 rounded-full font-medium flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : `${category.color} text-gray-700 dark:text-gray-300`
                } transition-colors`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video: SafeVideo) => (
              <div 
                key={video.id} 
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  logVideoWatch(video.id);
                  router.push(`/kid/watch?v=${video.youtube_video_id}`);
                }}
              >
                <div className="relative pb-[56.25%]">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
                    {video.thumbnail && (
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {video.channelName}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{video.views}</span>
                    <span>{new Date(video.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty state */
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No videos found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {selectedCategory 
                  ? "Try selecting a different category" 
                  : "Ask a parent to approve some channels for you"}
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Are you sure you want to exit?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You will need to enter your PIN again to return.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

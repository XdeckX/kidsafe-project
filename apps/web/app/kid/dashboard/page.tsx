"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  duration: string;
  views: string;
  publishedAt: string;
  categoryIds: string[];
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

const MOCK_VIDEOS: Video[] = [
  {
    id: "v1",
    title: "The Amazing World of Gumball - Best Episodes Compilation",
    thumbnail: "https://i.ytimg.com/vi/placeholder1/hqdefault.jpg",
    channelName: "Cartoon Network",
    duration: "22:30",
    views: "1.2M",
    publishedAt: "2023-10-15",
    categoryIds: ["cat1"]
  },
  {
    id: "v2",
    title: "Learn Colors with Play-Doh Ice Cream and Cookie Molds",
    thumbnail: "https://i.ytimg.com/vi/placeholder2/hqdefault.jpg",
    channelName: "Kids Learning Channel",
    duration: "15:45",
    views: "890K",
    publishedAt: "2023-11-20",
    categoryIds: ["cat2", "cat5"]
  },
  {
    id: "v3",
    title: "Baby Shark Dance | Kids Songs | Super Simple Songs",
    thumbnail: "https://i.ytimg.com/vi/placeholder3/hqdefault.jpg",
    channelName: "Super Simple Songs",
    duration: "2:16",
    views: "10.5B",
    publishedAt: "2018-06-02",
    categoryIds: ["cat3"]
  },
  {
    id: "v4",
    title: "How Do Plants Grow? | Easy Science Experiment for Kids",
    thumbnail: "https://i.ytimg.com/vi/placeholder4/hqdefault.jpg",
    channelName: "SciShow Kids",
    duration: "8:24",
    views: "1.7M",
    publishedAt: "2022-04-18",
    categoryIds: ["cat2", "cat4"]
  },
  {
    id: "v5",
    title: "DIY Slime Recipe - Easy Homemade Slime for Kids",
    thumbnail: "https://i.ytimg.com/vi/placeholder5/hqdefault.jpg",
    channelName: "Crafty Kids",
    duration: "12:33",
    views: "3.2M",
    publishedAt: "2023-01-10",
    categoryIds: ["cat5"]
  },
  {
    id: "v6",
    title: "Amazing Animal Facts for Kids - Wild Safari Adventure",
    thumbnail: "https://i.ytimg.com/vi/placeholder6/hqdefault.jpg",
    channelName: "Animal Planet Kids",
    duration: "18:45",
    views: "2.1M",
    publishedAt: "2022-08-22",
    categoryIds: ["cat6", "cat2"]
  }
];

export default function KidDashboard() {
  const router = useRouter();
  const [activeProfile, setActiveProfile] = useState<KidProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [isLoading, setIsLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    // Check for active kid profile
    const storedProfile = localStorage.getItem("kidsafe_active_kid");
    
    if (!storedProfile) {
      // Redirect to kid login if no active profile
      router.push("/kid/login");
      return;
    }
    
    try {
      setActiveProfile(JSON.parse(storedProfile));
    } catch (error) {
      console.error("Failed to parse active kid profile:", error);
      router.push("/kid/login");
    }
    
    // Simulate loading delay for frontend-first approach
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [router]);

  // Filter videos when category changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredVideos(MOCK_VIDEOS.filter(video => 
        video.categoryIds.includes(selectedCategory)
      ));
    } else {
      setFilteredVideos(MOCK_VIDEOS);
    }
  }, [selectedCategory]);

  // Mock function to log video watch for analytics
  const logVideoWatch = (videoId: string) => {
    try {
      const watchHistory = JSON.parse(localStorage.getItem("kidsafe_watch_history") || "[]");
      
      watchHistory.push({
        childId: activeProfile?.id,
        videoId,
        startTime: new Date().toISOString(),
        // In a real app, we'd track end time when the video completes
        duration: 0
      });
      
      localStorage.setItem("kidsafe_watch_history", JSON.stringify(watchHistory));
    } catch (error) {
      console.error("Failed to log video watch:", error);
    }
  };

  const handleExit = () => {
    // Clear active kid profile
    localStorage.removeItem("kidsafe_active_kid");
    router.push("/kid/login");
  };

  if (isLoading || !activeProfile) {
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
          {filteredVideos.map(video => (
            <div
              key={video.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                logVideoWatch(video.id);
                // In a real app, this would navigate to a video player page
                alert(`Playing video: ${video.title}`);
              }}
            >
              <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {video.channelName}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-500">
                  <span>{video.views} views</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredVideos.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
              No videos found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category
            </p>
          </div>
        )}
      </main>
      
      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Exit Kid Mode?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Are you sure you want to exit? You'll need to sign in again.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExit}
                className="flex-1 py-2 px-4 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors"
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

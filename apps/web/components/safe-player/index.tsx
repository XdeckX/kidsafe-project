"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";

interface SafePlayerProps {
  videoId: string;
  onVideoEnd?: () => void;
  autoplay?: boolean;
  title?: string;
}

export function SafePlayer({ videoId, onVideoEnd, autoplay = false, title }: SafePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerState, setPlayerState] = useState<'initial' | 'playing' | 'paused' | 'ended'>('initial');
  
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Setup YouTube iframe API
  useEffect(() => {
    // Initialize YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    return () => {
      // Clean up interval on unmount
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // For demo purposes, simulate video progress with a timer
  useEffect(() => {
    if (playerState === 'playing') {
      // Simulate progress by updating every second
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          // Mock video duration of 2 minutes (120 seconds) for demo
          const mockDuration = 120;
          
          if (newTime >= mockDuration) {
            clearInterval(progressIntervalRef.current!);
            setPlayerState('ended');
            onVideoEnd?.();
            return mockDuration;
          }
          
          setProgress((newTime / mockDuration) * 100);
          return newTime;
        });
      }, 1000);
    } else if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [playerState, onVideoEnd]);

  // Handle play/pause
  const togglePlay = () => {
    if (playerState === 'playing') {
      setPlayerState('paused');
    } else {
      setPlayerState('playing');
    }
    setIsPlaying(!isPlaying);
  };

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  // Format time (seconds) to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  // Set progress by clicking on the progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;
    
    // For demo - mock duration of 120 seconds
    const mockDuration = 120;
    const newTime = (percentage / 100) * mockDuration;
    
    setCurrentTime(newTime);
    setProgress(percentage);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full aspect-video bg-black relative rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={() => {
        /* Show controls on hover */
      }}
      onMouseLeave={() => {
        /* Hide controls after delay if playing */
      }}
    >
      {/* YouTube Embed */}
      <div className="w-full h-full">
        <iframe
          ref={playerRef}
          width="100%"
          height="100%"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&playsinline=1&autoplay=${autoplay ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
          title={title || "KidSafe YouTube Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        {/* Progress Bar */}
        <div 
          className="w-full h-2 bg-gray-600 rounded-full mb-2 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-kidsafe-violet rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="focus:outline-none">
              {playerState === 'playing' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            <button onClick={toggleMute} className="focus:outline-none">
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
            
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration || 120)}
            </span>
          </div>
          
          <button onClick={toggleFullscreen} className="focus:outline-none">
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Video Ended Screen */}
      {playerState === 'ended' && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
          <h3 className="text-2xl font-bold mb-4">Video Ended</h3>
          <div className="flex space-x-4">
            <Button 
              variant="kid" 
              onClick={() => {
                setPlayerState('playing');
                setCurrentTime(0);
                setProgress(0);
              }}
            >
              Watch Again
            </Button>
            {onVideoEnd && (
              <Button variant="outline" onClick={onVideoEnd}>
                Back to Videos
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

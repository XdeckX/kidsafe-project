"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApprovedChannels, Channel, ApprovedChannel } from "../../../../../packages/lib/src/hooks/useApprovedChannels";

// Client component that uses searchParams
function ChannelManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");
  
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [removedMessage, setRemovedMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedChildName, setSelectedChildName] = useState<string>("");
  
  // Redirect effect if no childId
  useEffect(() => {
    if (!childId) {
      router.push("/parent/dashboard");
    }
  }, [router, childId]);
  
  // Get the child's approved channels - use a default value if childId is null
  const { 
    approvedChannels, 
    loading, 
    error, 
    approveChannel, 
    removeChannel,
    getAvailableChannels 
  } = useApprovedChannels(childId || 'default');
  
  // Get all available channels
  const availableChannels = getAvailableChannels();
  
  // Get child name from localStorage
  useEffect(() => {
    const childProfiles = localStorage.getItem("kidsafe_profiles");
    if (childProfiles) {
      const profiles = JSON.parse(childProfiles);
      const child = profiles.find((p: any) => p.id === childId);
      if (child) {
        setSelectedChildName(child.name);
      }
    }
  }, [childId]);
  
  // Filter available channels based on search query
  const filteredAvailableChannels = availableChannels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (channel.description && channel.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle channel approval
  const handleApproveChannel = async (channel: Channel) => {
    try {
      await approveChannel(channel);
      setShowAddChannelModal(false);
      setSearchQuery("");
      // Optional: Show success message
      setRemovedMessage('Channel approved successfully');
      setTimeout(() => setRemovedMessage(''), 3000);
    } catch (error) {
      console.error('Error approving channel:', error);
      setErrorMessage('Failed to approve channel');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Handle channel removal
  const handleRemoveChannel = async (channelId: string) => {
    try {
      await removeChannel(channelId);
      setRemovedMessage('Channel removed successfully');
      setTimeout(() => setRemovedMessage(''), 3000);
    } catch (error) {
      console.error('Error removing channel:', error);
      setErrorMessage('Failed to remove channel');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // If no childId is provided, show a loading state while redirecting
  if (!childId) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Channel Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedChildName ? `Managing channels for ${selectedChildName}` : "Select a child profile"}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link 
              href="/parent/dashboard" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <p>Error loading channels: {error.message}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action buttons */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {approvedChannels.length} Approved Channels
              </h2>
              <button
                onClick={() => setShowAddChannelModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Channel
              </button>
            </div>
            
            {/* List of approved channels */}
            {approvedChannels.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Approved Channels</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Add YouTube channels that you want {selectedChildName} to be able to watch.
                </p>
                <button
                  onClick={() => setShowAddChannelModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-800/50"
                >
                  Add First Channel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedChannels.map((approvedChannel: ApprovedChannel) => (
                  <div 
                    key={approvedChannel.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
                  >
                    <div className="flex items-center p-4 border-b dark:border-gray-700">
                      {approvedChannel.channel?.thumbnail ? (
                        <img
                          src={approvedChannel.channel.thumbnail}
                          alt={approvedChannel.channel?.name || "Channel thumbnail"}
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {approvedChannel.channel?.name || approvedChannel.channel_id}
                        </h3>
                        {approvedChannel.channel?.subscriber_count && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {approvedChannel.channel.subscriber_count} subscribers
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveChannel(approvedChannel.channel_id)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                        title="Remove channel"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {approvedChannel.channel?.description || "No description available"}
                      </p>
                    </div>
                    
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                      <span>Approved on {new Date(approvedChannel.approved_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Add Channel Modal */}
      {showAddChannelModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowAddChannelModal(false)}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 shadow-xl overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b dark:border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Add YouTube Channel
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Search and select a channel to approve for {selectedChildName}
              </p>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    className="block w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="Search channels by name or description"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                {filteredAvailableChannels.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">No channels found matching your search</p>
                  </div>
                ) : (
                  filteredAvailableChannels.map((channel: Channel) => (
                    <div 
                      key={channel.id}
                      className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {channel.thumbnail ? (
                        <img
                          src={channel.thumbnail}
                          alt={channel.name}
                          className="h-12 w-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {channel.name}
                        </h4>
                        {channel.subscriber_count && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {channel.subscriber_count} subscribers • {channel.video_count} videos
                          </p>
                        )}
                        {channel.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {channel.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleApproveChannel(channel)}
                        className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Approve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowAddChannelModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main page component with Suspense
export default function ChannelManagementPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ChannelManagementContent />
    </Suspense>
  );
}

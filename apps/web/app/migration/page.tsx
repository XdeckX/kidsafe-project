'use client';

import { useState, useEffect } from 'react';
import { migrateToSupabase, isMigrationCompleted } from '../../lib/migrateToSupabase';

export default function MigrationPage() {
  const [migrationStatus, setMigrationStatus] = useState<'pending' | 'in-progress' | 'completed' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [alreadyMigrated, setAlreadyMigrated] = useState<boolean>(false);

  useEffect(() => {
    // Check if migration has already been done
    const migrationCompleted = isMigrationCompleted();
    setAlreadyMigrated(migrationCompleted);
    
    if (migrationCompleted) {
      setMigrationStatus('completed');
    }
  }, []);

  const handleMigration = async () => {
    try {
      setMigrationStatus('in-progress');
      await migrateToSupabase();
      setMigrationStatus('completed');
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Data Migration to Supabase</h2>
          <p className="text-gray-600">
            Migrate your locally stored data to the Supabase cloud database
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <p>
              This tool will transfer all your KidSafe data from your browser&apos;s localStorage to the Supabase cloud database. 
              This includes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Child profiles</li>
              <li>Approved YouTube channels</li>
              <li>Safe videos</li>
            </ul>
            
            {migrationStatus === 'pending' && !alreadyMigrated && (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="text-yellow-800">
                  Ready to migrate your data. Click the button below to begin the process.
                </p>
              </div>
            )}
            
            {migrationStatus === 'in-progress' && (
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-blue-800">
                  Migration in progress... This may take a few moments. Please don&apos;t close this browser tab.
                </p>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
                </div>
              </div>
            )}
            
            {migrationStatus === 'completed' && (
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <p className="text-green-800">
                  {alreadyMigrated 
                    ? 'Your data has already been migrated to Supabase. No action needed.' 
                    : 'Migration completed successfully! Your data is now stored in Supabase.'}
                </p>
              </div>
            )}
            
            {migrationStatus === 'error' && (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <p className="text-red-800">
                  Migration failed: {errorMessage || 'An unknown error occurred.'}
                </p>
                <p className="mt-2 text-red-800">
                  Please try again or contact support if the issue persists.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => window.location.href = '/'}
          >
            Back to Dashboard
          </button>
          
          {migrationStatus === 'pending' && !alreadyMigrated && (
            <button 
              onClick={handleMigration}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Migration
            </button>
          )}
          
          {migrationStatus === 'error' && (
            <button 
              onClick={handleMigration}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          )}
          
          {migrationStatus === 'completed' && (
            <button 
              className="px-4 py-2 text-green-600 opacity-50 cursor-not-allowed"
              disabled
            >
              ✓ Migration Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

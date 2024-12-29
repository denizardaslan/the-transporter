'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import type { DrivingData } from '@/lib/validation';
import { calculateComparison } from '@/lib/comparison';
import ComparisonInsights from '@/components/ComparisonInsights';
import Map from '@/components/Map';

interface FileRecord {
  id: number;
  name: string;
  content: string;
  uploadDate: string;
  metadata?: string;
}

interface ComparePageProps {
  params: {
    fileId: string;
  };
}

export default function ComparePage({ params }: ComparePageProps) {
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [currentFile, setCurrentFile] = useState<FileRecord | null>(null);
  const [otherFiles, setOtherFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonFile, setComparisonFile] = useState<FileRecord | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current trip
        const currentRes = await fetch(`/api/trips?fileId=${params.fileId}`);
        if (!currentRes.ok) {
          throw new Error('Failed to fetch current trip');
        }
        const currentFile = await currentRes.json();
        setCurrentFile(currentFile);

        // Fetch all other trips
        const allRes = await fetch('/api/trips');
        if (!allRes.ok) {
          throw new Error('Failed to fetch trips');
        }
        const allFiles = await allRes.json();
        setOtherFiles(allFiles.filter((file: FileRecord) => file.id !== parseInt(params.fileId)));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.fileId]);

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!selectedFileId) {
        setComparisonFile(null);
        return;
      }

      try {
        const res = await fetch(`/api/trips?fileId=${selectedFileId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch comparison trip');
        }
        const file = await res.json();
        setComparisonFile(file);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      }
    };

    fetchComparisonData();
  }, [selectedFileId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentFile) {
    notFound();
  }

  const currentData = JSON.parse(currentFile.content) as DrivingData;
  const comparisonData = comparisonFile ? JSON.parse(comparisonFile.content) as DrivingData : null;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-500">Trip Comparison</h1>

        {/* Current Trip Info */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Current Trip</h2>
          <p><strong className="text-gray-400">File:</strong> {currentFile.name}</p>
          <p><strong className="text-gray-400">Driver:</strong> {currentData.driverName || 'Unknown'}</p>
          <p><strong className="text-gray-400">Tyre Type:</strong> {currentData.tyreType || 'Unknown'}</p>
          <p><strong className="text-gray-400">Date:</strong> {new Date(currentData.session_start).toLocaleString()}</p>
        </div>

        {/* Trip Selection */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Select Trip to Compare</h2>
          <select
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={selectedFileId || ''}
            onChange={(e) => setSelectedFileId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Select a trip...</option>
            {otherFiles.map((file) => {
              const data = JSON.parse(file.content) as DrivingData;
              return (
                <option key={file.id} value={file.id}>
                  {file.name} - {data.driverName || 'Unknown'} ({new Date(data.session_start).toLocaleString()})
                </option>
              );
            })}
          </select>
        </div>

        {/* Comparison Insights */}
        {comparisonData && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Comparison Insights</h2>
              <ComparisonInsights
                insights={calculateComparison(currentData, comparisonData)}
              />
            </div>

            {/* Map Comparison */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-red-400">Route Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">Current Trip Route</h3>
                  <Map data={currentData} showMarkers={true} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-300">Comparison Trip Route</h3>
                  <Map data={comparisonData} showMarkers={true} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

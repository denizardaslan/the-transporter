'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function FileUpload() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }
      }

      router.refresh();
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload file(s)');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
        isDragging
          ? 'border-red-500 bg-gray-800'
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-4">
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm text-gray-300">
          {isUploading ? (
            <span className="text-red-400">Uploading...</span>
          ) : (
            <>
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-red-400 hover:text-red-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
              >
                <span>Upload telemetry</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="application/json"
                  multiple
                  onChange={(e) => handleUpload(e.target.files)}
                />
              </label>{' '}
              or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-gray-500">JSON files only</p>
      </div>
    </div>
  );
}


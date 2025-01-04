'use client';

import { useState } from 'react';
import { FileRecord } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FileListProps {
  files: FileRecord[];
}

interface FileMetadata {
  driverName: string | null;
  carModel: string | null;
  startLocation: {
    city: string;
    district: string;
    street: string;
  } | null;
  endLocation: {
    city: string;
    district: string;
    street: string;
  } | null;
}

export default function FileList({ files }: FileListProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/upload?fileId=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  const handleDownload = async (id: number, filename: string) => {
    try {
      const response = await fetch(`/api/upload?fileId=${id}`);
      const data = await response.json();

      const blob = new Blob([data.content], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleRename = async (id: number) => {
    if (!newName.trim()) return;

    try {
      const response = await fetch(`/api/upload?fileId=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newName: newName.trim() }),
      });

      if (response.ok) {
        setEditingId(null);
        setNewName('');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to rename file');
      }
    } catch (error) {
      console.error('Rename error:', error);
      alert('Failed to rename file');
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await fetch(`/api/upload?fileId=${id}`);
      const data = await response.json();
      
      const win = window.open('', '_blank');
      win?.document.write(`
        <html>
          <head>
            <title>Telemetry Data</title>
            <style>
              body { background-color: #1a202c; color: #e2e8f0; font-family: monospace; padding: 20px; }
              pre { white-space: pre-wrap; word-wrap: break-word; }
            </style>
          </head>
          <body>
            <pre>${JSON.stringify(JSON.parse(data.content), null, 2)}</pre>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('View error:', error);
      alert('Failed to view file');
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No telemetry files uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file) => {
        let metadata = file.metadata ? JSON.parse(file.metadata) as FileMetadata : null;
        const fileContent = JSON.parse(file.content);
        console.log('File metadata:', metadata);
        console.log('File content:', fileContent);
        const isExpanded = expandedId === file.id;

        // If metadata is missing but data is in the content, update metadata
        if (fileContent && (!metadata || !metadata.carModel)) {
          metadata = {
            driverName: fileContent.driverName,
            carModel: fileContent.carModel,
            startLocation: fileContent.startLocation ? {
              city: fileContent.startLocation.city,
              district: fileContent.startLocation.district,
              street: fileContent.startLocation.street
            } : null,
            endLocation: fileContent.endLocation ? {
              city: fileContent.endLocation.city,
              district: fileContent.endLocation.district,
              street: fileContent.endLocation.street
            } : null
          };
        }

        return (
          <div
            key={file.id}
            className="bg-gray-700 border border-gray-600 rounded-lg shadow-md overflow-hidden transition-all duration-200 ease-in-out"
          >
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-600"
              onClick={() => setExpandedId(isExpanded ? null : file.id)}
            >
              <div className="flex-1 min-w-0">
                {editingId === file.id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter new name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(file.id);
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setNewName('');
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-gray-100 truncate">{file.name}</h3>
                )}
                <p className="mt-1 text-sm text-gray-400">
                  Uploaded: {new Date(file.uploadDate).toLocaleString()}
                </p>
              </div>
              <div
                className="ml-4 text-gray-400 hover:text-gray-200"
              >
                {isExpanded ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </div>
            </div>
            {isExpanded && (
              <div className="px-4 pb-4 space-y-2">
                {metadata && (
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Driver: {metadata.driverName || 'Unknown'}</p>
                    <p>Car Model: {metadata.carModel || 'Unknown'}</p>
                    {metadata.startLocation && (
                      <p>Start Location: 📍 {metadata.startLocation.city}, {metadata.startLocation.district}, {metadata.startLocation.street}</p>
                    )}
                    {metadata.endLocation && (
                      <p>End Location: 🏁 {metadata.endLocation.city}, {metadata.endLocation.district}, {metadata.endLocation.street}</p>
                    )}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => router.push(`/driving/${file.id}`)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Analyze
                  </button>
                  <button
                    onClick={() => handleView(file.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(file.id, file.name)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Download
                  </button>
                  {editingId === file.id ? (
                    <button
                      onClick={() => handleRename(file.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(file.id);
                        setNewName(file.name);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Rename
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


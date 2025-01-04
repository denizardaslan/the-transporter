'use client';

import { useState, useEffect, useRef } from 'react';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import type { DrivingData } from '@/lib/validation';
import Map from './Map';

interface TripReplayProps {
  data: DrivingData;
}

export default function TripReplay({ data }: TripReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [speedTrend, setSpeedTrend] = useState<'increasing' | 'decreasing' | 'stable'>('stable');
  const intervalRef = useRef<NodeJS.Timeout>();

  const speedOptions = [1, 5, 10, 100];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set new interval with adjusted timing
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        if (prevIndex >= data.data.length - 1) {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return prevIndex;
        }

        // Calculate how many points to advance based on playback speed
        const increment = playbackSpeed === 1 ? 1 : 
                         playbackSpeed === 5 ? 5 :
                         playbackSpeed === 10 ? 10 : 20; // x100 will skip 20 points
        const nextIndex = Math.min(prevIndex + increment, data.data.length - 1);
        
        const currentPoint = data.data[prevIndex];
        const nextPoint = data.data[nextIndex];

        // Update speed and distance
        setCurrentSpeed(nextPoint.speed); // Remove 3.6 multiplication
        setCurrentDistance(nextPoint.distance / 1000); // Keep km conversion

        // Determine speed trend
        setSpeedTrend(
          nextPoint.speed > currentPoint.speed ? 'increasing' :
          nextPoint.speed < currentPoint.speed ? 'decreasing' : 'stable'
        );

        return nextIndex;
      });
    }, 1000 / (playbackSpeed >= 100 ? 10 : playbackSpeed)); // Adjust interval timing

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, data.data, playbackSpeed]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
    handleReset();
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setCurrentSpeed(0);
    setCurrentDistance(0);
    setSpeedTrend('stable');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newIndex = Math.floor(percentage * (data.data.length - 1));
    setCurrentIndex(newIndex);
    
    // Update current values
    const point = data.data[newIndex];
    setCurrentSpeed(point.speed);
    setCurrentDistance(point.distance / 1000);
    
    if (newIndex > 0) {
      const prevPoint = data.data[newIndex - 1];
      setSpeedTrend(
        point.speed > prevPoint.speed ? 'increasing' :
        point.speed < prevPoint.speed ? 'decreasing' : 'stable'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Trip Replay</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Current Distance</h3>
            <p className="mt-1 text-lg text-gray-200">
              📏 {currentDistance.toFixed(2)} km
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Current Speed</h3>
            <p className={`mt-1 text-lg ${
              speedTrend === 'increasing' ? 'text-green-400' :
              speedTrend === 'decreasing' ? 'text-red-400' :
              'text-gray-200'
            }`}>
              🚗 {currentSpeed.toFixed(2)} km/h
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400">Progress</h3>
            <p className="mt-1 text-lg text-gray-200">
              {Math.round((currentIndex / (data.data.length - 1)) * 100)}%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <PlayIcon className="h-6 w-6" />
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
              >
                <StopIcon className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Speed:</span>
            {speedOptions.map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded ${
                  playbackSpeed === speed
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                x{speed}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div 
          className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer"
          onClick={handleTimelineClick}
        >
          <div
            className="h-full bg-red-600 transition-all duration-200"
            style={{ width: `${(currentIndex / (data.data.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Map */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Route Visualization</h2>
        <Map data={data} showMarkers={true} currentPosition={currentIndex} />
      </div>
    </div>
  );
} 
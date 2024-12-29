import type { DrivingData } from './validation';

interface ComparisonInsights {
  totalDistance: {
    current: number;
    comparison: number;
    difference: number;
    percentageDiff: number;
  };
  totalTime: {
    current: number;
    comparison: number;
    difference: number;
    percentageDiff: number;
  };
  averageSpeed: {
    current: number;
    comparison: number;
    difference: number;
    percentageDiff: number;
  };
  maxSpeed: {
    current: number;
    comparison: number;
    difference: number;
    percentageDiff: number;
  };
}

export function calculateComparison(currentTrip: DrivingData, comparisonTrip: DrivingData): ComparisonInsights {
  // Calculate total distance (in kilometers) - use last point's distance
  const currentDistance = currentTrip.data[currentTrip.data.length - 1].distance / 1000;
  const comparisonDistance = comparisonTrip.data[comparisonTrip.data.length - 1].distance / 1000;

  // Calculate total time (in minutes)
  const currentStartTime = parseFloat(currentTrip.session_start);
  const currentEndTime = currentTrip.session_end 
    ? parseFloat(currentTrip.session_end)
    : parseFloat(currentTrip.data[currentTrip.data.length - 1].timestamp);
  const currentTime = (currentEndTime - currentStartTime) / 60; // Convert seconds to minutes

  const comparisonStartTime = parseFloat(comparisonTrip.session_start);
  const comparisonEndTime = comparisonTrip.session_end 
    ? parseFloat(comparisonTrip.session_end)
    : parseFloat(comparisonTrip.data[comparisonTrip.data.length - 1].timestamp);
  const comparisonTime = (comparisonEndTime - comparisonStartTime) / 60; // Convert seconds to minutes

  // Calculate average speed (km/h)
  const currentSpeeds = currentTrip.data.map(point => point.speed);
  const comparisonSpeeds = comparisonTrip.data.map(point => point.speed);
  
  const currentAvgSpeed = (currentSpeeds.reduce((a, b) => a + b) / currentSpeeds.length) * 3.6; // Convert m/s to km/h
  const comparisonAvgSpeed = (comparisonSpeeds.reduce((a, b) => a + b) / comparisonSpeeds.length) * 3.6;

  // Calculate max speed (km/h)
  const currentMaxSpeed = Math.max(...currentSpeeds) * 3.6; // Convert m/s to km/h
  const comparisonMaxSpeed = Math.max(...comparisonSpeeds) * 3.6;

  // Calculate differences and percentage differences
  const calculateDiff = (current: number, comparison: number) => ({
    difference: current - comparison,
    percentageDiff: ((current - comparison) / comparison) * 100
  });

  return {
    totalDistance: {
      current: Math.round(currentDistance * 100) / 100,
      comparison: Math.round(comparisonDistance * 100) / 100,
      ...calculateDiff(currentDistance, comparisonDistance)
    },
    totalTime: {
      current: Math.round(currentTime * 100) / 100,
      comparison: Math.round(comparisonTime * 100) / 100,
      ...calculateDiff(currentTime, comparisonTime)
    },
    averageSpeed: {
      current: Math.round(currentAvgSpeed * 100) / 100,
      comparison: Math.round(comparisonAvgSpeed * 100) / 100,
      ...calculateDiff(currentAvgSpeed, comparisonAvgSpeed)
    },
    maxSpeed: {
      current: Math.round(currentMaxSpeed * 100) / 100,
      comparison: Math.round(comparisonMaxSpeed * 100) / 100,
      ...calculateDiff(currentMaxSpeed, comparisonMaxSpeed)
    }
  };
} 
import { DrivingData } from './validation';

export interface DrivingInsights {
  driverName: string | null;
  tyreType: string | null;
  carModel: string | null;
  startLocation: {
    city: string;
    street: string;
    district: string;
  } | null;
  endLocation: {
    city: string;
    street: string;
    district: string;
  } | null;
  totalDistance: number | null;
  totalTime: number | null; // in seconds
  averageSpeed: number | null;
  maxSpeed: number | null;
  minSpeed: number | null;
  hasData: boolean;
}

export function calculateInsights(data: DrivingData): DrivingInsights {
  const drivingPoints = data.data;

  if (!drivingPoints || drivingPoints.length === 0) {
    return {
      driverName: data.driverName,
      tyreType: data.tyreType,
      carModel: data.carModel,
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      totalDistance: null,
      totalTime: null,
      averageSpeed: null,
      maxSpeed: null,
      minSpeed: null,
      hasData: false,
    };
  }
  
  // Calculate total distance (last point's distance)
  // Convert from meters to kilometers
  const totalDistance = drivingPoints[drivingPoints.length - 1].distance / 1000;

  // Debug log timestamps
  console.log('Session Start:', data.session_start);
  console.log('Session End:', data.session_end);
  console.log('First Point Timestamp:', drivingPoints[0].timestamp);
  console.log('Last Point Timestamp:', drivingPoints[drivingPoints.length - 1].timestamp);

  // Calculate total time directly from Unix timestamps
  // The timestamps are already in seconds, so we can subtract them directly
  const startTime = parseFloat(data.session_start);
  const endTime = data.session_end 
    ? parseFloat(data.session_end)
    : parseFloat(drivingPoints[drivingPoints.length - 1].timestamp);
  
  // Debug log parsed times
  console.log('Start Time (s):', startTime);
  console.log('End Time (s):', endTime);
  console.log('Difference (s):', endTime - startTime);
  
  // Calculate total time in seconds
  const totalTime = Math.round(endTime - startTime);
  console.log('Total Time (seconds):', totalTime);

  // Calculate speeds
  const speeds = drivingPoints.map(point => point.speed);
  const maxSpeed = Math.max(...speeds);
  const minSpeed = Math.min(...speeds);
  
  // Calculate average speed as the mean of all speed points
  const averageSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;

  return {
    driverName: data.driverName,
    tyreType: data.tyreType,
    carModel: data.carModel,
    startLocation: data.startLocation,
    endLocation: data.endLocation,
    totalDistance: Math.round(totalDistance * 100) / 100, // Round to 2 decimal places
    totalTime,
    averageSpeed: Math.round(averageSpeed * 100) / 100,
    maxSpeed: Math.round(maxSpeed * 100) / 100,
    minSpeed: Math.round(minSpeed * 100) / 100,
    hasData: true,
  };
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return 'N/A';
  
  // Convert seconds to minutes and round to 2 decimal places
  const minutes = Math.round((seconds / 60) * 100) / 100;
  return `${minutes} min`;
} 
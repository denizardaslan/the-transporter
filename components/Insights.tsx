import { DrivingInsights } from '@/lib/data-processing';
import { formatDuration } from '@/lib/data-processing';

interface InsightsProps {
  insights: DrivingInsights;
}

export default function Insights({ insights }: InsightsProps) {
  if (!insights.hasData) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Driving Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Driver Name</h3>
              <p className="mt-1 text-lg text-gray-200">{insights.driverName || 'Unknown'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Car Model</h3>
              <p className="mt-1 text-lg text-gray-200">{insights.carModel || 'Unknown'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Tyre Type</h3>
              <p className="mt-1 text-lg text-gray-200">{insights.tyreType || 'Unknown'}</p>
            </div>
          </div>

          {/* No Data Message */}
          <div className="md:col-span-2 text-center py-8">
            <p className="text-lg text-gray-400">
              No driving data available for this trip.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
      <h2 className="text-2xl font-bold mb-6 text-red-500">Driving Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Row */}
        <div>
          <h3 className="text-sm font-medium text-gray-400">Driver Name</h3>
          <p className="mt-1 text-lg text-gray-200">🏎️ {insights.driverName || 'Unknown'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">Total Time</h3>
          <p className="mt-1 text-lg text-gray-200">🕑 {formatDuration(insights.totalTime)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">Car Model</h3>
          <p className="mt-1 text-lg text-gray-200">🚗 {insights.carModel || 'Unknown'}</p>
        </div>

        {/* Second Row */}
        {insights.startLocation && (
          <div>
            <h3 className="text-sm font-medium text-gray-400">Start Location</h3>
            <p className="mt-1 text-lg text-gray-200">
              📍 {insights.startLocation.city}, {insights.startLocation.district}
            </p>
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-400">Total Distance</h3>
          <p className="mt-1 text-lg text-gray-200">
            📏 {insights.totalDistance !== null ? `${insights.totalDistance.toFixed(2)} km` : 'N/A'}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">Average Speed</h3>
          <p className="mt-1 text-lg text-blue-400">
            🚗 {insights.averageSpeed !== null ? `${insights.averageSpeed.toFixed(2)} km/h` : 'N/A'}
          </p>
        </div>

        {/* Third Row */}
        {insights.endLocation && (
          <div>
            <h3 className="text-sm font-medium text-gray-400">End Location</h3>
            <p className="mt-1 text-lg text-gray-200">
              🏁 {insights.endLocation.city}, {insights.endLocation.district}
            </p>
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-400">Tyre Type</h3>
          <p className="mt-1 text-lg text-gray-200">🛞 {insights.tyreType || 'Unknown'}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-400">Maximum Speed</h3>
          <p className="mt-1 text-lg text-green-400">
            🚀 {insights.maxSpeed !== null ? `${insights.maxSpeed.toFixed(2)} km/h` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}

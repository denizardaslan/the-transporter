interface MetricProps {
    label: string;
    current: number;
    comparison: number;
    difference: number;
    percentageDiff: number;
    unit: string;
    decimals?: number;
  }
  
  function Metric({ label, current, comparison, difference, percentageDiff, unit, decimals = 2 }: MetricProps) {
    const format = (value: number) => value.toFixed(decimals);
    const isPositive = difference > 0;
  
    return (
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4">
        <h3 className="text-lg font-semibold mb-2 text-red-400">{label}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Current</p>
            <p className="text-lg font-medium text-gray-200">{format(current)} {unit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Comparison</p>
            <p className="text-lg font-medium text-gray-200">{format(comparison)} {unit}</p>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className="text-sm">
            <span className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '↑' : '↓'} {format(Math.abs(difference))} {unit}
            </span>
            <span className="text-gray-400 ml-1">
              ({isPositive ? '+' : ''}{format(percentageDiff)}%)
            </span>
          </p>
        </div>
      </div>
    );
  }
  
  interface ComparisonInsightsProps {
    insights: {
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
    };
  }
  
  export default function ComparisonInsights({ insights }: ComparisonInsightsProps) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Metric
          label="Total Distance"
          {...insights.totalDistance}
          unit="km"
        />
        <Metric
          label="Total Time"
          {...insights.totalTime}
          unit="min"
        />
        <Metric
          label="Average Speed"
          {...insights.averageSpeed}
          unit="km/h"
        />
        <Metric
          label="Max Speed"
          {...insights.maxSpeed}
          unit="km/h"
        />
      </div>
    );
  }
  
  
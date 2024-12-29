import { getFileById } from '@/lib/db';
import { calculateInsights } from '@/lib/data-processing';
import Insights from '@/components/Insights';
import TripReplay from '@/components/TripReplay';
import { DrivingData } from '@/lib/validation';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: {
    fileId: string;
  };
}

export default function DrivingAnalysisPage({ params }: Props) {
  const file = getFileById(parseInt(params.fileId));
  
  if (!file) {
    notFound();
  }

  const drivingData = JSON.parse(file.content) as DrivingData;
  const insights = calculateInsights(drivingData);

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-red-500">{file.name}</h1>
            <p className="text-gray-400 mt-2">
              Uploaded on {new Date(file.uploadDate).toLocaleString()}
            </p>
          </div>
          <Link
            href={`/driving/${params.fileId}/compare`}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Compare with Another Trip
          </Link>
        </div>

        <div className="space-y-8">
          <Insights insights={insights} />
          
          {insights.hasData && (
            <TripReplay data={drivingData} />
          )}
        </div>
      </div>
    </main>
  );
}


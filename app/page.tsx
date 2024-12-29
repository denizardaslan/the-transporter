import { getAllFiles } from '@/lib/db';
import FileList from '@/components/FileList';
import FileUpload from '@/components/FileUpload';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const files = getAllFiles();

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500 text-center mb-10">
          Driving Analytics Dashboard
        </h1>
        
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-10 border border-gray-700">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Upload New Telemetry</h2>
            <FileUpload />
          </div>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Telemetry Files</h2>
            <FileList files={files} />
          </div>
        </div>
      </div>
    </main>
  );
}

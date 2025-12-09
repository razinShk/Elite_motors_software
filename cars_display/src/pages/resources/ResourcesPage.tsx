import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeViewer from './CodeViewer';
import AssetsGallery from './AssetsGallery';
import SetupGuide from './SetupGuide';
import DownloadButton from './DownloadButton';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold font-serif tracking-tight">Student Resources</h1>
          </div>
          <DownloadButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-16">
            {/* Introduction */}
            <section>
              <h2 className="text-3xl font-bold font-serif mb-4">Project Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                This project demonstrates how to build a high-performance, minimalist landing page using React and Tailwind CSS. 
                Explore the source code, download assets, and follow the setup guide to build this yourself.
              </p>
            </section>

            {/* Code Viewer */}
            <section id="code">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-serif">Source Code</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Read-only view</span>
              </div>
              <CodeViewer />
            </section>

            {/* Assets */}
            <section id="assets">
              <h2 className="text-2xl font-bold font-serif mb-6">Project Assets</h2>
              <AssetsGallery />
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gray-50 rounded-xl p-6 border sticky top-24">
              <h2 className="text-xl font-bold font-serif mb-6">Setup & Run</h2>
              <SetupGuide />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

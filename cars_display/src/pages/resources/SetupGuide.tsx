import { Terminal, Play, Download, Package } from 'lucide-react';

export default function SetupGuide() {
  const steps = [
    {
      title: "Prerequisites",
      icon: <Package className="w-5 h-5" />,
      content: (
        <ul className="list-disc list-inside space-y-1 text-gray-600 ml-1">
          <li>Node.js (v16 or higher)</li>
          <li>npm (v7 or higher) or yarn</li>
          <li>Git (optional, for cloning)</li>
        </ul>
      )
    },
    {
      title: "Installation",
      icon: <Download className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">Clone the repository and install dependencies:</p>
          <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
            <p className="mb-1"><span className="text-gray-500"># Clone repository</span></p>
            <p className="mb-2">git clone https://github.com/yourusername/dodge-challenger-landing.git</p>
            <p className="mb-1"><span className="text-gray-500"># Navigate to directory</span></p>
            <p className="mb-2">cd dodge-challenger-landing</p>
            <p className="mb-1"><span className="text-gray-500"># Install dependencies</span></p>
            <p>npm install</p>
          </div>
        </div>
      )
    },
    {
      title: "Development",
      icon: <Play className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">Start the development server:</p>
          <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm">
            <p>npm run dev</p>
          </div>
          <p className="text-gray-600 text-sm">The application will be available at <code className="bg-gray-100 px-1 py-0.5 rounded text-black">http://localhost:5173</code></p>
        </div>
      )
    },
    {
      title: "Building for Production",
      icon: <Terminal className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-gray-600">Create a production build:</p>
          <div className="bg-gray-900 text-gray-100 p-3 rounded-md font-mono text-sm">
            <p>npm run build</p>
          </div>
          <p className="text-gray-600 text-sm">The built files will be in the <code className="bg-gray-100 px-1 py-0.5 rounded text-black">dist</code> directory.</p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
              {step.icon}
            </div>
            {index !== steps.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mx-auto mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <div className="text-sm">{step.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

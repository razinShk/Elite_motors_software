import { useState } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';

const files = {
  'src': {
    type: 'folder',
    children: {
      'components': {
        type: 'folder',
        children: {
          'Hero.tsx': { type: 'file', content: `import CarDisplay from './CarDisplay';\nimport Specs from './Specs';\nimport Info from './Info';\n\nexport default function Hero() {\n  return (\n    <div className="min-h-screen w-full grid grid-cols-12 relative bg-[#FDFDFD] overflow-hidden">\n      {/* Main Content Area (Car + Info) */}\n      <div className="col-span-8 md:col-span-9 flex flex-col relative min-h-screen">\n        {/* Car Section */}\n        <div className="flex-grow relative flex items-center justify-center pt-10 md:pt-0">\n          <CarDisplay />\n        </div>\n        \n        {/* Info Section */}\n        <div className="p-6 md:p-12 md:pb-16 z-20">\n          <Info />\n        </div>\n      </div>\n      {/* Right Sidebar (Specs) */}\n      <div className="col-span-4 md:col-span-3 flex flex-col items-center md:items-start justify-start py-0 md:py-0 pt-5 md:pt-[100px] bg-[#FDFDFD] relative z-20 text-base font-normal text-black text-left">\n        <Specs />\n      </div>\n    </div>\n  );\n}` },
          'CarDisplay.tsx': { type: 'file', content: `import hellcat from '../assets/hellcat.png';\n\nexport default function CarDisplay() {\n  return (\n    <div className="relative w-full h-[50vh] md:h-full flex items-center justify-center">\n      {/* Vertical Lines */}\n      <div className="absolute left-[15%] top-0 bottom-0 flex gap-6 h-full z-0 opacity-80">\n        <div className="w-3 md:w-4 bg-[#2A2A2A] h-full"></div>\n        <div className="w-3 md:w-4 bg-[#2A2A2A] h-full"></div>\n      </div>\n\n      {/* Background Text */}\n      <div className="absolute top-[40%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none">\n        <span className="text-[120px] sm:text-[180px] md:text-[280px] lg:text-[350px] font-serif text-[#F0F0F0] font-bold leading-none tracking-tighter">\n          1981\n        </span>\n      </div>\n\n      {/* Car Image */}\n      <div className="relative z-10 w-full max-w-[90%] md:max-w-4xl px-4 mt-0 md:mt-0">\n        <img \n          src={hellcat} \n          alt="Dodge Challenger Hellcat" \n          className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 ease-out"\n        />\n      </div>\n    </div>\n  );\n}` },
          'Specs.tsx': { type: 'file', content: `export default function Specs() {\n  const specs = [\n    { label: "Engine", value: "V8" },\n    { label: "Power", value: "707 bhp" },\n    { label: "Weight", value: "4449 lbs" },\n    { label: "Top Speed", value: "199 mph" },\n  ];\n\n  return (\n    <div className="flex flex-col justify-start space-y-8 md:space-y-16 pr-0 md:pr-12 w-full h-full">\n      {specs.map((spec, index) => (\n        <div key={index} className="flex flex-col items-center md:items-start gap-1 md:gap-3 group cursor-default">\n          <span className="text-gray-400 uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold relative px-2 md:pl-0 md:pr-4">\n            <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></span>\n            {spec.label}\n            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></span>\n          </span>\n          <span className="text-lg md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 group-hover:scale-110 md:group-hover:translate-x-2 transition-transform duration-300 origin-center md:origin-left">\n            {spec.value}\n          </span>\n        </div>\n      ))}\n    </div>\n  );\n}` },
          'Info.tsx': { type: 'file', content: `import { ArrowLeft, ArrowRight } from 'lucide-react';\n\nexport default function Info() {\n  return (\n    <div className="w-full max-w-2xl pl-0 md:pl-[15%]">\n      <div className="flex items-center justify-between mb-6 pr-8">\n        <div className="flex gap-6">\n          <button className="group p-3 hover:bg-black hover:text-white rounded-full transition-all duration-300 border border-transparent hover:border-black">\n            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 transform group-hover:-translate-x-1 transition-transform" />\n          </button>\n          <button className="group p-3 hover:bg-black hover:text-white rounded-full transition-all duration-300 border border-transparent hover:border-black">\n            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transform group-hover:translate-x-1 transition-transform" />\n          </button>\n        </div>\n        \n        <div className="flex gap-8 text-sm font-semibold text-gray-300 select-none">\n          <span className="text-black relative cursor-pointer after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-black after:rounded-full transition-all">1</span>\n          <span className="hover:text-gray-500 cursor-pointer transition-colors">2</span>\n          <span className="hover:text-gray-500 cursor-pointer transition-colors">3</span>\n          <span className="hover:text-gray-500 cursor-pointer transition-colors">4</span>\n        </div>\n      </div>\n\n      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">\n        Dodge Challenger SRT\n      </h1>\n      <p className="text-gray-500 leading-relaxed mb-8 text-sm md:text-base max-w-lg font-medium">\n        The Dodge Challenger SRT Hellcat is a high-performance variant of the Challenger. \n        With a supercharged 6.2-liter HEMI V8 engine, it redefined the modern muscle car era.\n        <a href="#" className="ml-2 text-black font-bold underline decoration-2 underline-offset-4 hover:text-gray-700 transition-colors">\n          Contact to buy\n        </a>\n      </p>\n    </div>\n  );\n}` }
        }
      },
      'App.tsx': { type: 'file', content: `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport Hero from './components/Hero';\nimport ResourcesPage from './pages/resources/ResourcesPage';\n\nfunction App() {\n  return (\n    <Router>\n      <Routes>\n        <Route path="/" element={<Hero />} />\n        <Route path="/resources" element={<ResourcesPage />} />\n      </Routes>\n    </Router>\n  );\n}\n\nexport default App;` },
      'main.tsx': { type: 'file', content: `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.tsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n)` }
    }
  }
};

const FileTreeItem = ({ name, item, level = 0, onSelect, selectedFile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === 'folder';
  const isSelected = selectedFile === name;

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-100 font-medium' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onSelect(name, item.content);
        }}
      >
        {isFolder && (
          isOpen ? <ChevronDown className="w-4 h-4 mr-1 text-gray-500" /> : <ChevronRight className="w-4 h-4 mr-1 text-gray-500" />
        )}
        {!isFolder && <FileCode className="w-4 h-4 mr-2 text-blue-500" />}
        {isFolder && <Folder className="w-4 h-4 mr-2 text-yellow-500" />}
        <span className="text-sm text-gray-700">{name}</span>
      </div>
      {isFolder && isOpen && (
        <div>
          {Object.entries(item.children).map(([childName, childItem]) => (
            <FileTreeItem 
              key={childName} 
              name={childName} 
              item={childItem} 
              level={level + 1} 
              onSelect={onSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CodeViewer() {
  const [selectedFile, setSelectedFile] = useState('Hero.tsx');
  const [fileContent, setFileContent] = useState(files.src.children.components.children['Hero.tsx'].content);
  const [copied, setCopied] = useState(false);

  const handleSelect = (name, content) => {
    setSelectedFile(name);
    setFileContent(content);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm flex flex-col md:flex-row h-[500px]">
      <div className="w-full md:w-64 border-r bg-gray-50 overflow-y-auto">
        <div className="p-3 border-b bg-gray-100 font-semibold text-sm text-gray-700">Project Files</div>
        <div className="py-2">
          {Object.entries(files).map(([name, item]) => (
            <FileTreeItem 
              key={name} 
              name={name} 
              item={item} 
              onSelect={handleSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between p-3 border-b bg-white">
          <span className="font-medium text-sm text-gray-700">{selectedFile}</span>
          <button 
            onClick={handleCopy}
            className="flex items-center text-xs text-gray-500 hover:text-black transition-colors"
          >
            {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-900 text-gray-100 font-mono text-sm">
          <pre className="whitespace-pre-wrap break-words">
            <code>{fileContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

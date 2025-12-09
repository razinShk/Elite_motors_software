import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import hellcat from '../../assets/hellcat.png';
import bg from '../../assets/youware-bg.png';

// Import raw file content
import heroCode from '../../components/Hero.tsx?raw';
import carDisplayCode from '../../components/CarDisplay.tsx?raw';
import specsCode from '../../components/Specs.tsx?raw';
import infoCode from '../../components/Info.tsx?raw';
import appCode from '../../App.tsx?raw';
import mainCode from '../../main.tsx?raw';
import indexCssCode from '../../index.css?raw';
import viteEnvCode from '../../vite-env.d.ts?raw';

// Resources page files
import resourcesPageCode from './ResourcesPage.tsx?raw';
import codeViewerCode from './CodeViewer.tsx?raw';
import assetsGalleryCode from './AssetsGallery.tsx?raw';
import setupGuideCode from './SetupGuide.tsx?raw';
import downloadButtonCode from './DownloadButton.tsx?raw';

export default function DownloadButton() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      
      // Root files
      zip.file("index.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dodge Challenger SRT</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

      zip.file("package.json", JSON.stringify({
        "name": "dodge-challenger-landing",
        "private": true,
        "version": "0.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        },
        "dependencies": {
          "lucide-react": "^0.533.0",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "react-router-dom": "^6.30.1",
          "jszip": "^3.10.1",
          "file-saver": "^2.0.5"
        },
        "devDependencies": {
          "@types/react": "^18.3.1",
          "@types/react-dom": "^18.3.1",
          "@vitejs/plugin-react": "^4.5.2",
          "autoprefixer": "^10.4.21",
          "postcss": "^8.5.6",
          "tailwindcss": "^3.4.17",
          "typescript": "~5.8.3",
          "vite": "^7.0.0",
          "@types/file-saver": "^2.0.7"
        }
      }, null, 2));

      zip.file("vite.config.ts", `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});`);

      zip.file("tsconfig.json", JSON.stringify({
        "files": [],
        "references": [
          { "path": "./tsconfig.app.json" },
          { "path": "./tsconfig.node.json" }
        ]
      }, null, 2));

      zip.file("tsconfig.app.json", JSON.stringify({
        "compilerOptions": {
          "target": "ES2022",
          "useDefineForClassFields": true,
          "lib": ["ES2022", "DOM", "DOM.Iterable"],
          "module": "ESNext",
          "skipLibCheck": true,
          "moduleResolution": "bundler",
          "allowImportingTsExtensions": true,
          "verbatimModuleSyntax": false,
          "moduleDetection": "force",
          "noEmit": true,
          "jsx": "react-jsx"
        },
        "include": ["src"]
      }, null, 2));

      zip.file("tsconfig.node.json", JSON.stringify({
        "compilerOptions": {
          "target": "ES2023",
          "lib": ["ES2023"],
          "module": "ESNext",
          "skipLibCheck": true,
          "moduleResolution": "bundler",
          "allowImportingTsExtensions": true,
          "verbatimModuleSyntax": true,
          "moduleDetection": "force",
          "noEmit": true,
          "strict": true,
          "noUnusedLocals": true,
          "noUnusedParameters": true,
          "noFallthroughCasesInSwitch": true,
          "noUncheckedSideEffectImports": true
        },
        "include": ["vite.config.ts"]
      }, null, 2));

      zip.file("tailwind.config.js", `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`);

      zip.file("postcss.config.js", `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`);

      zip.file("README.md", `# Dodge Challenger Landing Page

A minimalist landing page built with React and Tailwind CSS.

## Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`
`);

      zip.file(".gitignore", `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`);

      // src folder
      const src = zip.folder("src");
      src?.file("App.tsx", appCode);
      src?.file("main.tsx", mainCode);
      src?.file("index.css", indexCssCode);
      src?.file("vite-env.d.ts", viteEnvCode);

      // src/components
      const components = src?.folder("components");
      components?.file("Hero.tsx", heroCode);
      components?.file("CarDisplay.tsx", carDisplayCode);
      components?.file("Specs.tsx", specsCode);
      components?.file("Info.tsx", infoCode);

      // src/pages/resources
      const pages = src?.folder("pages");
      const resources = pages?.folder("resources");
      resources?.file("ResourcesPage.tsx", resourcesPageCode);
      resources?.file("CodeViewer.tsx", codeViewerCode);
      resources?.file("AssetsGallery.tsx", assetsGalleryCode);
      resources?.file("SetupGuide.tsx", setupGuideCode);
      resources?.file("DownloadButton.tsx", downloadButtonCode);

      // src/assets
      const assets = src?.folder("assets");
      const hellcatBlob = await fetch(hellcat).then(r => r.blob());
      const bgBlob = await fetch(bg).then(r => r.blob());
      assets?.file("hellcat.png", hellcatBlob);
      assets?.file("youware-bg.png", bgBlob);

      // public folder
      const publicFolder = zip.folder("public");
      // Add public assets here if any. Currently only yw_manifest.json which is platform specific.
      // But standard vite project usually has favicon or similar. We can add a placeholder favicon.
      
      // Generate zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "dodge-challenger-project.zip");
      
    } catch (error) {
      console.error("Error generating zip:", error);
      alert("Failed to generate ZIP file. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating ZIP...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download Project ZIP
        </>
      )}
    </button>
  );
}

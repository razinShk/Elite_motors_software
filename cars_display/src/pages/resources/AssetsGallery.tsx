import hellcat from '../../assets/hellcat.png';
import bg from '../../assets/youware-bg.png';

export default function AssetsGallery() {
  const assets = [
    { name: 'hellcat.png', src: hellcat, type: 'Image (PNG)', size: '1.2 MB' },
    { name: 'youware-bg.png', src: bg, type: 'Image (PNG)', size: '850 KB' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {assets.map((asset, index) => (
        <div key={index} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="h-48 bg-gray-100 flex items-center justify-center p-4 relative group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <img 
              src={asset.src} 
              alt={asset.name} 
              className="max-h-full max-w-full object-contain relative z-10"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <a 
                href={asset.src} 
                download={asset.name}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
              >
                Download
              </a>
            </div>
          </div>
          <div className="p-4 border-t">
            <h3 className="font-medium text-gray-900 truncate">{asset.name}</h3>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>{asset.type}</span>
              <span>{asset.size}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

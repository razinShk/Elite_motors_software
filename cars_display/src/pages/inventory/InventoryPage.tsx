import { motion, Variants } from 'framer-motion';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import hellcat from '../../assets/hellcat.png';

// Mock data for the inventory
const CARS = [
  { id: 1, year: '2023', make: 'Dodge', model: 'Challenger SRT Hellcat', price: '$85,000', image: hellcat },
  { id: 2, year: '2022', make: 'Dodge', model: 'Charger SRT Hellcat', price: '$82,000', image: hellcat }, // Using same image as placeholder
  { id: 3, year: '2024', make: 'Ford', model: 'Mustang Dark Horse', price: '$65,000', image: hellcat },
  { id: 4, year: '2023', make: 'Chevrolet', model: 'Corvette Z06', price: '$110,000', image: hellcat },
  { id: 5, year: '2023', make: 'BMW', model: 'M4 Competition', price: '$95,000', image: hellcat },
  { id: 6, year: '2023', make: 'Porsche', model: '911 Carrera S', price: '$135,000', image: hellcat },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <h1 className="text-2xl font-serif font-bold text-center absolute left-1/2 -translate-x-1/2 hidden md:block">
            Inventory
          </h1>

          <div className="flex gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Available Vehicles</h2>
          <p className="text-gray-500 max-w-2xl">
            Explore our curated selection of high-performance vehicles.
            Each car is meticulously inspected and details-ready.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {CARS.map((car) => (
            <motion.div
              key={car.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden flex items-center justify-center p-6">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.img
                  layoutId={`car-${car.id}`}
                  src={car.image}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500 ease-out z-10"
                />

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm z-20">
                  {car.year}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">{car.make}</h3>
                    <h4 className="text-xl font-serif font-bold text-gray-900 group-hover:text-black transition-colors">
                      {car.model}
                    </h4>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xl font-bold">{car.price}</span>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-black transition-colors flex items-center gap-1">
                    View Details
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

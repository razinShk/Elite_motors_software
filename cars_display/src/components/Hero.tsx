import { motion } from 'framer-motion';
import CarDisplay from './CarDisplay';
import Specs from './Specs';
import Info from './Info';

export default function Hero() {
  return (
    <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-12 relative bg-[#FDFDFD] overflow-hidden">
      {/* Main Content Area (Car + Info) */}
      <div className="w-full md:col-span-9 flex flex-col relative">
        {/* Car Section - Takes up most of the space */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex-grow relative flex items-center justify-center pt-10 md:pt-0"
        >
          <CarDisplay />
        </motion.div>
        
        {/* Info Section - Positioned at bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="p-6 md:p-12 md:pb-16 z-20"
        >
          <Info />
        </motion.div>
      </div>
      {/* Right Sidebar (Specs) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="w-full md:col-span-3 flex flex-col items-center md:items-start justify-start py-8 md:py-0 md:pt-[100px] bg-[#FDFDFD] relative z-20 text-base font-normal text-black text-left"
      >
        <Specs />
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import hellcat from '../assets/hellcat.png';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CarDisplay() {
  return (
    <div className="relative w-full h-[65vh] md:h-full flex items-center justify-center">
      {/* Vertical Lines - Fixed position relative to this container */}
      <div className="absolute left-[15%] top-0 bottom-0 flex gap-6 h-full z-0 opacity-80">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
          className="w-3 md:w-4 bg-[#2A2A2A] h-full"
        ></motion.div>
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
          className="w-3 md:w-4 bg-[#2A2A2A] h-full"
        ></motion.div>
      </div>

      {/* Background Text */}
      <div className="absolute top-[30%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none">
        <motion.span 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-[120px] sm:text-[180px] md:text-[280px] lg:text-[350px] font-serif text-[#F0F0F0] font-bold leading-none tracking-tighter block"
        >
          1981
        </motion.span>
      </div>

      {/* Car Image */}
      <div className="relative z-10 w-full max-w-[90%] md:max-w-4xl px-4 mt-0 md:mt-0 -translate-y-10 md:-translate-y-16">
        <motion.img 
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          src={hellcat} 
          alt="Dodge Challenger Hellcat" 
          className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Controls - Positioned near the tyre (bottom right of car image) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-[15%] right-[15%] md:bottom-[20%] md:right-[10%] flex flex-col items-end gap-4 z-20"
        >
          {/* Arrows */}
          <div className="flex gap-4">
            <button className="group p-2 md:p-3 hover:bg-black hover:text-white rounded-full transition-all duration-300 border border-transparent hover:border-black bg-white/80 backdrop-blur-sm shadow-sm">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transform group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="group p-2 md:p-3 hover:bg-black hover:text-white rounded-full transition-all duration-300 border border-transparent hover:border-black bg-white/80 backdrop-blur-sm shadow-sm">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Numbers */}
          <div className="flex gap-6 text-xs md:text-sm font-semibold text-gray-400 select-none bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-black relative cursor-pointer after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-black after:rounded-full transition-all">1</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">2</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">3</span>
            <span className="hover:text-gray-600 cursor-pointer transition-colors">4</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

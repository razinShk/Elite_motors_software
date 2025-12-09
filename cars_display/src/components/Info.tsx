import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Info() {
  return (
    <div className="w-full max-w-2xl pl-0 md:pl-[15%] -mt-10 md:-mt-20 relative z-30">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight"
      >
        Dodge Challenger SRT
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-gray-500 leading-relaxed mb-8 text-sm md:text-base max-w-lg font-medium"
      >
        <p className="mb-4">
          The Dodge Challenger SRT Hellcat is a high-performance variant of the Challenger.
          With a supercharged 6.2-liter HEMI V8 engine, it redefined the modern muscle car era.
        </p>
        <div className="flex gap-6 mt-6 items-center">
          <Link to="/inventory" className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg flex items-center gap-2">
            View Inventory
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#" className="text-black font-bold underline decoration-2 underline-offset-4 hover:text-gray-700 transition-colors">
            Contact to buy
          </a>
          <Link to="/resources" className="flex items-center gap-2 text-gray-600 font-medium hover:text-black transition-colors group">
            <span className="bg-gray-100 p-1.5 rounded-full group-hover:bg-gray-200 transition-colors">
              <BookOpen className="w-3 h-3" />
            </span>
            Student Resources
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

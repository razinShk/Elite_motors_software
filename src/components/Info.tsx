import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface InfoProps {
    name: string;
    description: string;
}

export default function Info({ name, description }: InfoProps) {
    return (
        <div className="w-full max-w-2xl pl-0 md:pl-[15%] mt-0 md:-mt-32 relative z-30">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="hidden md:block text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight"
            >
                {name}
            </motion.h1>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-gray-500 leading-relaxed mb-8 text-sm md:text-base max-w-lg font-medium"
            >
                <p className="mb-4">
                    {description}
                </p>
                <div className="flex gap-6 mt-6 items-center">
                    <Link to="/public-inventory" className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                        View Inventory
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                        href={`https://wa.me/917447360478?text=${encodeURIComponent(`Hello, I am interested in buying the ${name}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black font-bold underline decoration-2 underline-offset-4 hover:text-gray-700 transition-colors"
                    >
                        Contact to buy
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
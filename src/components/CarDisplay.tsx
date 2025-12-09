import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CarDisplayProps {
    image: string;
    year: string;
    images?: string[];
}

export default function CarDisplay({ image, year, images = [] }: CarDisplayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Combine main image (if not in array) with images array or just use array
    // Strategy: If images array exists and has content, use it. 
    // If not, fall back to single image.
    const displayImages = images.length > 0 ? images : [image];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    // Reset index if images change
    useEffect(() => {
        setCurrentIndex(0);
    }, [images]);

    return (
        <div className="relative w-full h-auto min-h-[50vh] py-20 md:py-0 md:h-full flex items-center justify-center">
            {/* Background Text */}
            <div className="absolute top-[30%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none">
                <motion.span
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-[120px] sm:text-[180px] md:text-[280px] lg:text-[350px] font-serif text-[#F0F0F0] font-bold leading-none tracking-tighter block"
                >
                    {year}
                </motion.span>
            </div>

            {/* Car Image */}
            <div className="relative z-10 w-full max-w-[90%] md:max-w-4xl px-4 mt-0 md:mt-0 -translate-y-10 md:-translate-y-16">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        src={displayImages[currentIndex]}
                        alt={`Car Display ${currentIndex + 1}`}
                        className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 ease-out cursor-pointer"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(_e, { offset }) => {
                            const swipe = offset.x; // offset.x > 0 is right swipe (prev), < 0 is left (next)
                            if (swipe < -50) handleNext();
                            else if (swipe > 50) handlePrev();
                        }}
                    />
                </AnimatePresence>

                {/* Controls - Positioned near the tyre (bottom right of car image) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="absolute bottom-[-40px] right-[5%] md:bottom-[10%] md:right-[10%] flex flex-col items-end gap-4 z-20"
                >
                    {/* Arrows */}
                    <div className="flex gap-4">
                        <button
                            onClick={handlePrev}
                            className="group p-2 md:p-3 hover:bg-black hover:text-white rounded-full transition-all duration-300 border border-transparent hover:border-black bg-white/80 backdrop-blur-sm shadow-sm"
                            disabled={displayImages.length <= 1}
                        >
                            <ArrowLeft className={`w-4 h-4 md:w-5 md:h-5 transform group-hover:-translate-x-1 transition-transform ${displayImages.length <= 1 ? 'opacity-50' : ''}`} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="group p-2 md:p-3 hover:bg-black hover:text-white rounded-full transition-all duration-300 border border-transparent hover:border-black bg-white/80 backdrop-blur-sm shadow-sm"
                            disabled={displayImages.length <= 1}
                        >
                            <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform ${displayImages.length <= 1 ? 'opacity-50' : ''}`} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Image Indicators (Dots) - Optional but helpful */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                    {displayImages.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-black w-4' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
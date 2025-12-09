import { motion } from 'framer-motion';
import CarDisplay from './CarDisplay';
import Specs from './Specs';
import Info from './Info';
import { useShowroomCars } from '@/hooks/useShowroomCars';
import { Loader2, ArrowUpRight, Phone } from 'lucide-react';
import hellcat from '../assets/hellcat.png'; // Fallback
import { Link, useParams } from 'react-router-dom';

export default function CarsDisplayHero() {
    const { id } = useParams();
    const { data: cars, isLoading } = useShowroomCars();

    // Find the specific car by ID, or featured, or first one
    const featuredCar = id
        ? cars?.find(c => c.id === id)
        : (cars?.find(c => c.is_featured) || cars?.[0]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Fallback data structure if no cars in DB yet
    const displayCar = featuredCar ? {
        year: featuredCar.year,
        image: featuredCar.image_url || hellcat,
        name: `${featuredCar.make} ${featuredCar.model}`,
        description: featuredCar.description || "No description available",
        specs: [
            { label: "Engine", value: featuredCar.engine || "N/A" },
            { label: "Power", value: featuredCar.power || "N/A" },
            { label: "Weight", value: featuredCar.weight || "N/A" },
            { label: "Top Speed", value: featuredCar.top_speed || "N/A" },
        ]
    } : {
        year: "1981",
        image: hellcat,
        name: "Dodge Challenger SRT",
        description: "The Dodge Challenger SRT Hellcat is a high-performance variant of the Challenger. With a supercharged 6.2-liter HEMI V8 engine, it redefined the modern muscle car era.",
        specs: [
            { label: "Engine", value: "V8" },
            { label: "Power", value: "707 bhp" },
            { label: "Weight", value: "4449 lbs" },
            { label: "Top Speed", value: "199 mph" },
        ]
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:grid md:grid-cols-12 relative bg-[#FDFDFD] overflow-y-auto md:overflow-hidden">

            {/* Car Name - Fixed at top left */}
            <div className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/20">
                <h1 className="text-lg md:text-2xl font-bold font-serif tracking-tight text-black">{displayCar.name}</h1>
            </div>

            {/* Contact Buttons - Fixed at top */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
                <a
                    href="tel:+917447360478"
                    className="flex items-center justify-center bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-all shadow-lg border border-gray-200"
                    title="Call Us"
                >
                    <Phone className="w-5 h-5" />
                </a>
                <a
                    href={`https://wa.me/917447360478?text=${encodeURIComponent(`Hello, I am interested in buying the ${displayCar.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                >
                    Get a quote
                    <ArrowUpRight className="w-3 h-3" />
                </a>
            </div>

            {/* Main Content Area (Car + Info) */}
            <div className="w-full md:col-span-9 flex flex-col relative">
                {/* Vertical Lines - Spans full height of this column */}
                <div className="absolute left-[15%] top-0 bottom-0 flex gap-6 h-full z-0 opacity-80 pointer-events-none">
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
                {/* Car Section - Takes up most of the space */}
                {/* Car Section - Takes up most of the space */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-grow relative flex items-center justify-center pt-10 md:pt-0"
                >
                    <CarDisplay
                        image={displayCar.image}
                        year={displayCar.year}
                        images={featuredCar?.elite_showroom_car_images?.map(img => img.image_url)}
                    />
                </motion.div>

                {/* Mobile Specs - Shown only on mobile, after Car/Arrows, before Info */}
                <div className="md:hidden mt-0 mb-8 z-20">
                    <Specs specs={displayCar.specs} />
                </div>

                {/* Info Section - Positioned at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    className="p-6 md:p-12 md:pb-0 z-20"
                >
                    <Info name={displayCar.name} description={displayCar.description} />
                </motion.div>

            </div>
            {/* Right Sidebar (Specs) - Desktop Only */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                className="hidden md:flex w-full md:col-span-3 flex-col items-center md:items-start justify-start py-8 md:py-0 md:pt-[100px] bg-[#FDFDFD] relative z-20 text-base font-normal text-black text-left"
            >
                <Specs specs={displayCar.specs} />
            </motion.div>
        </div>
    );
}

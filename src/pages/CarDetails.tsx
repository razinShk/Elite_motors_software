import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Menu, MessageSquare, Info, ArrowRight, Users, Gauge, Zap, Activity, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShowroomCars } from '@/hooks/useShowroomCars';
import { AnimatePresence, motion } from 'framer-motion';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: cars, isLoading } = useShowroomCars();

    // Find key logic
    const car = cars?.find(c => c.id === id);

    // State for Image Carousel logic (reusing simplified version)
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const displayImages = car ? (car.elite_showroom_car_images?.length ? car.elite_showroom_car_images.map(img => img.image_url) : [car.image_url]) : [];

    useEffect(() => {
        if (!isLoading && !car) {
            // Optional: redirect or show not found
        }
    }, [isLoading, car]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Car not found</h1>
                <Button onClick={() => navigate('/public-inventory')}>Back to Inventory</Button>
            </div>
        );
    }

    const handleNextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % displayImages.length);
    }

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + displayImages.length) % displayImages.length);
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-50 shrink-0">
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-2xl font-black tracking-tighter italic">
                        Elite Car Detailing <span className="block text-[10px] font-normal not-italic tracking-widest text-slate-400 uppercase">Premium Cars</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/public-inventory">
                        <Button variant="ghost" className="rounded-full hover:bg-slate-100">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 pt-4 pb-8 flex-1 flex flex-col justify-center">
                {/* Hero Section */}
                <div className="relative flex-1 flex flex-col items-center justify-center min-h-0">

                    {/* Title Area */}
                    <div className="absolute top-0 left-0 z-10">
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-1">
                            {car.make} <span className="font-light">- {car.model}</span>
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide">{car.year} Edition</p>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute top-0 right-0 z-10">
                        <h2 className="text-3xl font-bold text-slate-900">{car.price}</h2>
                    </div>

                    {/* Car Image Carousel */}
                    <div className="relative w-full max-w-7xl mx-auto mt-20 mb-12 flex items-center justify-center min-h-[50vh]">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImageIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                src={displayImages[currentImageIndex]}
                                alt={car.model}
                                className="w-full h-auto max-h-[70vh] object-contain drop-shadow-2xl"
                            />
                        </AnimatePresence>

                        {/* Arrows */}
                        {displayImages.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-0 md:left-10 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur shadow-lg rounded-full hover:bg-black hover:text-white transition-all z-20"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-0 md:right-10 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur shadow-lg rounded-full hover:bg-black hover:text-white transition-all z-20"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-[-30px] flex gap-2">
                                    {displayImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-black' : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-8 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            Specifications & Details
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Engine */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <Zap className="w-5 h-5 text-slate-400 mb-2" />
                            <p className="text-slate-400 text-xs mb-1">Engine</p>
                            <p className="font-bold text-sm">{car.engine || 'N/A'}</p>
                        </div>

                        {/* Power */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <Activity className="w-5 h-5 text-slate-400 mb-2" />
                            <p className="text-slate-400 text-xs mb-1">Power</p>
                            <p className="font-bold text-sm">{car.power || 'N/A'}</p>
                        </div>

                        {/* Top Speed */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <Gauge className="w-5 h-5 text-slate-400 mb-2" />
                            <p className="text-slate-400 text-xs mb-1">Top Speed</p>
                            <p className="font-bold text-sm">{car.top_speed || 'N/A'}</p>
                        </div>

                        {/* Weight */}
                        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <Users className="w-5 h-5 text-slate-400 mb-2" />
                            <p className="text-slate-400 text-xs mb-1">Weight</p>
                            <p className="font-bold text-sm">{car.weight || 'N/A'}</p>
                        </div>

                        {/* Description - Spans 2 cols on tablet+ */}
                        <div className="col-span-2 md:col-span-1 lg:col-span-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
                            <Info className="w-5 h-5 text-slate-400 mb-2" />
                            <p className="text-slate-400 text-xs mb-1">Description</p>
                            <p className="font-medium text-xs line-clamp-3" title={car.description}>{car.description || 'No description available.'}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CarDetails;

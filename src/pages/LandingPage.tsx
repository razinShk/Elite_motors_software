import { useState, useEffect } from 'react';
import { ArrowRight, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';

function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openContact = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsContactOpen(true);
    };

    return (
        <div className="h-screen bg-black text-white overflow-y-scroll snap-y snap-mandatory overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : ''}`}>
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <a href="#home" className="text-xl font-medium hover:opacity-80 transition-opacity">Elite Car Detailing</a>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#services" className="text-white/80 hover:text-white transition-colors">Services</a>
                        <Link to="/public-inventory" className="text-white/80 hover:text-white transition-colors">Cars</Link>
                        <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
                        <a href="#booking-form" className="text-white/80 hover:text-white transition-colors">Contact</a>
                    </div>

                    <a
                        href="https://wa.me/917447360478?text=Hello%2C%20I%20am%20interested%20in%20car%20detailing%20services."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white rounded-lg px-6 py-3 hover:bg-white hover:text-black transition-all"
                    >
                        Get a quote
                    </a>
                </div>
            </nav>

            {/* Contact Modal */}
            <AnimatePresence>
                {isContactOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsContactOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[#FDFDFD] rounded-2xl overflow-hidden shadow-2xl z-10"
                        >
                            <button
                                onClick={() => setIsContactOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-50"
                            >
                                <X className="w-5 h-5 text-black" />
                            </button>
                            <div className="pt-8">
                                <ContactForm />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section id="home" className="relative h-screen snap-start flex items-center justify-center pt-24">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/hero-background.png"
                        alt="Background"
                        className="w-full h-full object-cover md:hidden"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black"></div>
                    {/* Hero Car Image */}
                    <div className="absolute inset-0 hidden md:block">
                        <img
                            src="/assets/hero-car.png"
                            alt="Luxury Car"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                    </div>
                </div>

                {/* Decorative Blur Circle */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-[500px]"></div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-7xl md:text-9xl font-medium mb-8 leading-tight"
                    >
                        Luxury car detailing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
                    >
                        Experience the prestige of a professionally detailed car,
                        radiating elegance and refinement at every turn.
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                        onClick={openContact}
                        className="group inline-flex items-center gap-4 text-xl font-medium hover:translate-x-2 transition-transform"
                    >
                        Let's connect
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </motion.button>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="relative min-h-screen snap-start py-32 bg-black flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-medium mb-6">Love in Every Detail</h2>
                        <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                            Immerse yourself in luxury with our bespoke detailing packages tailored to your car's unique needs.
                        </p>
                    </motion.div>

                    {/* Service Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Entry Level Detail */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="group relative rounded-2xl overflow-hidden"
                        >
                            <img
                                src="/assets/entry-level-detail.png"
                                alt="Entry Level Detail"
                                className="w-full h-80 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h3 className="text-2xl font-medium mb-4">Entry level detail</h3>
                                <p className="text-gray-400 mb-6">
                                    Treat your luxury car to a thorough hand wash and wax application.
                                </p>
                                <button onClick={openContact} className="inline-flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                                    Learn more
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Maintenance Detail */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="group relative rounded-2xl overflow-hidden"
                        >
                            <img
                                src="/assets/maintenance-detail.png"
                                alt="Maintenance Detail"
                                className="w-full h-80 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h3 className="text-2xl font-medium mb-4">Maintenance detail</h3>
                                <p className="text-gray-400 mb-6">
                                    Ensure your car's longevity with a periodic exterior protection treatment.
                                </p>
                                <button onClick={openContact} className="inline-flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                                    Learn more
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Full Detail */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="group relative rounded-2xl overflow-hidden"
                        >
                            <img
                                src="/assets/full-detail.png"
                                alt="Full Detail"
                                className="w-full h-80 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h3 className="text-2xl font-medium mb-4">Full detail</h3>
                                <p className="text-gray-400 mb-6">
                                    Pamper your vehicle with a complete treatment, leaving no detail overlooked.
                                </p>
                                <button onClick={openContact} className="inline-flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                                    Learn more
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Care & Features Section */}
            <section id="about" className="relative min-h-screen snap-start py-32 bg-black flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Column - Title & Car */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-5xl md:text-6xl font-medium mb-12 leading-tight">
                                We will take good<br />care of your car
                            </h2>
                            <div className="relative">
                                <img
                                    src="/assets/care-car.png"
                                    alt="Car Care"
                                    className="w-full h-auto object-contain"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            </div>
                        </motion.div>

                        {/* Right Column - Features */}
                        <div className="space-y-12">
                            {/* Feature 1 */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <h3 className="text-2xl font-medium">Precise work</h3>
                                </div>
                                <p className="text-gray-400 pl-10 leading-relaxed">
                                    We uphold the highest standards of professionalism when servicing your vehicles.
                                </p>
                                <div className="h-px bg-white/10 mt-8 ml-10"></div>
                            </motion.div>

                            {/* Feature 2 */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <h3 className="text-2xl font-medium">Premium Products and Services</h3>
                                </div>
                                <p className="text-gray-400 pl-10 leading-relaxed">
                                    Ensure your car's longevity with a periodic exterior protection treatment.
                                </p>
                                <div className="h-px bg-white/10 mt-8 ml-10"></div>
                            </motion.div>

                            {/* Feature 3 */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <h3 className="text-2xl font-medium">High-Level Security and Privacy</h3>
                                </div>
                                <p className="text-gray-400 pl-10 leading-relaxed">
                                    We understand the importance of privacy and security for their our clientele.
                                </p>

                                <button
                                    onClick={openContact}
                                    className="inline-flex items-center gap-2 text-white mt-8 ml-10 hover:gap-4 transition-all"
                                >
                                    Get a quote now
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Showreel Section */}
            <section className="relative h-screen snap-start flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/showreel-bg.png"
                        alt="Showreel Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center justify-center group cursor-pointer"
                >
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/20">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                    <p className="text-white text-xl font-medium tracking-wide">Play showreel</p>
                </motion.div>
            </section>

            {/* CTA Section - Booking aka Contact Form on Landing Page */}
            <section id="booking-form" className="relative h-screen snap-start flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/hero-background.png"
                        alt="Background"
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-5xl md:text-6xl font-medium mb-6 leading-tight">
                                Book your luxury<br />car detailing today
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-md">
                                We are ready to transform your vehicle. Click below to start the conversation.
                            </p>
                            <button
                                onClick={openContact}
                                className="inline-flex items-center gap-2 text-white text-xl border border-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all"
                            >
                                Start Inquiry
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="relative snap-start py-20 bg-black border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
                    >
                        {/* Brand */}
                        <div>
                            <h3 className="text-xl font-medium mb-4">Elite Car Detailing</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Experience the prestige of a professionally detailed car, radiating elegance and refinement at every turn.
                            </p>
                        </div>

                        {/* Website */}
                        <div>
                            <h4 className="text-gray-400 font-medium mb-4">Website</h4>
                            <ul className="space-y-3">
                                <li><a href="#services" className="text-white hover:text-gray-300 transition-colors">Services</a></li>
                                <li><a href="#pricing" className="text-white hover:text-gray-300 transition-colors">Pricing</a></li>
                                <li><a href="#about" className="text-white hover:text-gray-300 transition-colors">About</a></li>
                                <li><button onClick={openContact} className="text-gray-400 hover:text-gray-300 transition-colors text-left">Contact</button></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-gray-400 font-medium mb-4">Contact</h4>
                            <ul className="space-y-3">
                                <li><a href="https://wa.me/917447360478?text=Hello%2C%20I%20am%20interested%20in%20car%20detailing%20services." target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">Get a quote</a></li>
                                <li><button onClick={openContact} className="text-white hover:text-gray-300 transition-colors text-left">Contact form</button></li>
                                <li><a href="#" className="text-white hover:text-gray-300 transition-colors">Email us</a></li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h4 className="text-gray-400 font-medium mb-4">Social Media</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-white hover:text-gray-300 transition-colors">Facebook</a></li>
                                <li><a href="#" className="text-white hover:text-gray-300 transition-colors">Instagram</a></li>
                                <li><a href="#" className="text-white hover:text-gray-300 transition-colors">Twitter</a></li>
                                <li><a href="#" className="text-white hover:text-gray-300 transition-colors">Youtube</a></li>
                            </ul>
                        </div>
                    </motion.div>

                    {/* Bottom Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <p className="text-white font-medium">Elite Car Detailing © 2024</p>
                        <div className="flex items-center gap-8">
                            <a href="#" className="text-white hover:text-gray-300 transition-colors">Privacy policy</a>
                            <a href="#" className="text-white hover:text-gray-300 transition-colors">Terms of service</a>
                            <a href="#" className="text-white hover:text-gray-300 transition-colors">Cookie policy</a>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;

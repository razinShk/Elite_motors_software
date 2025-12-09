import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactFormProps {
    carName?: string;
}

export default function ContactForm({ carName = 'Car Detailing' }: ContactFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const text = `*New Inquiry for ${carName}*\n\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message || 'I am interested in your services.'}`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/917447360478?text=${encodedText}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl px-6 md:px-12 pb-20 relative z-30"
        >
            <div className="bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="text-2xl font-serif font-bold mb-2">Interested? Let's Talk.</h3>
                <p className="text-gray-500 mb-6 text-sm">Fill out the form below and we'll connect on WhatsApp automatically.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Your Name"
                            className="bg-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            placeholder="Phone Number"
                            type="tel"
                            className="bg-white"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Any specific questions? (Optional)"
                            className="bg-white resize-none"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white gap-2">
                        Send via WhatsApp
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </motion.div>
    );
}

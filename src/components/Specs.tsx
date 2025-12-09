import { motion } from 'framer-motion';

interface Spec {
    label: string;
    value: string;
}

interface SpecsProps {
    specs: Spec[];
}

export default function Specs({ specs }: SpecsProps) {
    return (
        <div className="grid grid-cols-2 gap-8 md:flex md:flex-col md:gap-0 md:space-y-16 pr-0 md:pr-12 w-full h-auto min-h-[200px] pb-12 px-6 md:px-0">
            {specs.map((spec, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                    className="flex flex-col items-center md:items-start gap-1 md:gap-3 group cursor-default"
                >
                    <span className="text-gray-400 uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold relative px-2 md:pl-0 md:pr-4">
                        <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {spec.label}
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </span>
                    <span className="text-lg md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 group-hover:scale-110 md:group-hover:translate-x-2 transition-transform duration-300 origin-center md:origin-left">
                        {spec.value}
                    </span>
                </motion.div>
            ))}
        </div>
    );
}
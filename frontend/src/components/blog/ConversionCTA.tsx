'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConversionCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            if (isDismissed) return;

            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > 40) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDismissed]);

    if (!mounted || isDismissed) return null;

    return (
        <div className={cn(
            "fixed bottom-8 left-8 z-[60] max-w-sm w-full transition-all duration-700 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        )}>
            <div className="relative bg-black-secondary border border-green-primary/30 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group">
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-primary/5 blur-[60px] rounded-full group-hover:bg-green-primary/10 transition-all duration-700" />

                <button
                    onClick={() => setIsDismissed(true)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-primary/10 flex items-center justify-center text-green-primary">
                            <MessageSquare size={20} />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-green-primary uppercase">Consultoria IA</span>
                    </div>

                    <h4 className="text-xl font-bold font-heading text-white leading-tight">
                        Quer automatizar sua empresa com IA?
                    </h4>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        Nossos especialistas podem ajudar você a implementar estas mesmas estratégias.
                    </p>

                    <button className="mt-2 w-full bg-green-primary hover:bg-green-secondary text-black-base font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        FALAR COM ESPECIALISTA
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

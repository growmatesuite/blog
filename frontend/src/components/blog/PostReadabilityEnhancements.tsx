'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { List, ChevronRight, X } from 'lucide-react';

interface Header {
    id: string;
    text: string;
    level: number;
}

interface PostReadabilityEnhancementsProps {
    headers: Header[];
}

export function PostReadabilityEnhancements({ headers }: PostReadabilityEnhancementsProps) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [activeHeader, setActiveHeader] = useState<string | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        setMounted(true);
        // 1. Progress Bar Logic
        const updateScroll = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight && scrollHeight > 0) {
                setReadingProgress(Math.min(100, Math.max(0, (currentProgress / scrollHeight) * 100)));
            }
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();

        // 2. Intersection Observer for Scroll-Spy
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            // Find the first entry that is intersecting or above the threshold
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveHeader(entry.target.id);
                }
            });
        };

        observerRef.current = new IntersectionObserver(handleIntersection, {
            rootMargin: '0px 0px -80% 0px', // Trigger when header is in the top 20% of viewport
            threshold: 0.1
        });

        headers.forEach((header) => {
            const el = document.getElementById(header.id);
            if (el) observerRef.current?.observe(el);
        });

        return () => {
            window.removeEventListener('scroll', updateScroll);
            observerRef.current?.disconnect();
        };
    }, [headers]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = 100;
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setIsMobileOpen(false);
            // Manually set active header for immediate feedback
            setActiveHeader(id);
        }
    };

    if (!mounted) return null;

    return (
        <>
            {/* Progress Bar - ALWAYS VISIBLE */}
            <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-white/5">
                <div
                    className="h-full bg-gradient-to-r from-green-primary via-purple-primary to-green-primary bg-[length:200%_100%] animate-gradient transition-all duration-150"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {(!headers || headers.length === 0) ? null : (
                <>
                    {/* Mobile ToC Toggle */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-green-primary text-black-base shadow-2xl shadow-green-primary/40 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 focus:ring-offset-black-base"
                        aria-label="Abrir Índice"
                    >
                        {isMobileOpen ? <X size={24} /> : <List size={24} />}
                    </button>

                    {/* Mobile Menu Overlay */}
                    <div className={cn(
                        "lg:hidden fixed inset-0 z-[45] bg-black-base/95 backdrop-blur-2xl transition-all duration-500",
                        isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}>
                        <div className="flex flex-col h-full p-8 pt-24 overflow-hidden">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <List className="text-green-primary" />
                                Índice do Artigo
                            </h2>
                            <nav className="space-y-6 overflow-y-auto pb-20 custom-scrollbar">
                                {headers.map((header) => (
                                    <button
                                        key={header.id}
                                        onClick={() => scrollTo(header.id)}
                                        className={cn(
                                            "flex items-start gap-3 w-full text-left transition-all duration-300",
                                            header.level > 2 ? "pl-6 text-sm" : "text-lg font-medium",
                                            activeHeader === header.id ? "text-green-primary" : "text-gray-400 hover:text-white"
                                        )}
                                    >
                                        <ChevronRight size={16} className={cn("mt-1.5 transition-transform flex-shrink-0", activeHeader === header.id ? "rotate-90 text-green-primary" : "opacity-20")} />
                                        <span>{header.text}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Sticky Table of Contents (Desktop Only) */}
                    <aside className="hidden lg:block fixed left-[max(1.5rem,calc((100vw-1200px)/2-18rem))] top-40 w-64 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase border-l-2 border-green-primary/30 pl-4">
                                Índice
                            </div>
                            <nav className="space-y-4 relative overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
                                {/* Vertical line indicator */}
                                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5" />

                                {headers.map((headerItem) => (
                                    <button
                                        key={headerItem.id}
                                        onClick={() => scrollTo(headerItem.id)}
                                        className={cn(
                                            "group relative block w-full text-left transition-all duration-300 pl-4 border-l-2 -ml-[2px]",
                                            headerItem.level > 2 ? "pl-8 text-xs py-1" : "py-1.5 text-sm",
                                            activeHeader === headerItem.id
                                                ? "text-green-primary border-green-primary font-bold translate-x-1"
                                                : "text-gray-500 border-transparent font-medium hover:text-white hover:border-white/20"
                                        )}
                                    >
                                        <span className="line-clamp-2">{headerItem.text}</span>
                                        {activeHeader === headerItem.id && (
                                            <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-primary shadow-[0_0_10px_rgba(0,186,124,0.6)] animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}

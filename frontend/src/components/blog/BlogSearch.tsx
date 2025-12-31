'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BlogSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [isFocused, setIsFocused] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            router.push(`/blog?q=${encodeURIComponent(trimmedQuery)}`);
        } else {
            router.push('/blog');
        }
    };

    const clearSearch = () => {
        setQuery('');
        router.push('/blog');
    };

    if (!mounted) return <div className="h-16 max-w-xl mx-auto mb-16 bg-white/5 rounded-2xl animate-pulse" />;

    return (
        <form
            onSubmit={handleSearch}
            className={cn(
                "relative max-w-xl mx-auto mb-16 transition-all duration-300",
                isFocused ? "scale-[1.02]" : "scale-100"
            )}
        >
            <div className={cn(
                "relative flex items-center bg-black-secondary border rounded-2xl p-1 transition-all duration-300",
                isFocused ? "border-green-primary/50 shadow-[0_0_20px_rgba(0,229,153,0.1)]" : "border-white/10"
            )}>
                <Search className={cn(
                    "ml-4 transition-colors shrink-0",
                    isFocused ? "text-green-primary" : "text-gray-500"
                )} size={20} />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={mounted && window.innerWidth < 640 ? "Buscar artigos..." : "O que sua empresa quer escalar hoje?"}
                    className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-0 min-w-0"
                />

                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="p-2 text-gray-500 hover:text-white transition-colors shrink-0"
                    >
                        <X size={18} />
                    </button>
                )}

                <button
                    type="submit"
                    className="bg-white/5 hover:bg-white/10 text-white font-bold py-2 px-4 sm:px-6 rounded-xl transition-all mr-1 shrink-0 flex items-center justify-center min-w-[44px]"
                >
                    <span className="hidden sm:inline">BUSCAR</span>
                    <Search className="sm:hidden" size={18} />
                </button>
            </div>

            <div className="absolute -bottom-6 left-6 flex flex-wrap gap-3">
                {['IA', 'Automação', 'Growth'].map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => {
                            setQuery(tag);
                            router.push(`/blog?q=${tag}`);
                        }}
                        className="text-[10px] font-bold text-gray-600 hover:text-green-primary transition-colors tracking-widest whitespace-nowrap"
                    >
                        #{tag}
                    </button>
                ))}
            </div>
        </form>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStatus('success');
        setEmail('');
    };

    if (!mounted) return null;

    return (
        <section className="relative w-full py-20 overflow-hidden bg-black-base">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-black-tertiary via-black-secondary to-black-tertiary rounded-[2rem] md:rounded-[3rem] border border-white/5 p-6 md:p-16 relative overflow-hidden group">
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-primary/5 blur-[100px] rounded-full group-hover:bg-green-primary/10 transition-all duration-1000" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-primary/5 blur-[100px] rounded-full group-hover:bg-purple-primary/10 transition-all duration-1000" />

                    <div className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
                        <div className="space-y-4 md:space-y-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-primary/10 border border-green-primary/20 text-green-primary text-[10px] font-bold uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-primary animate-pulse" />
                                Newsletter Semanal
                            </span>
                            <h2 className="text-2xl md:text-5xl font-bold font-heading text-white leading-tight">
                                Mantenha-se à frente com insights de <span className="text-gradient-brand">IA & Automação</span>
                            </h2>
                            <p className="text-gray-500 text-sm md:text-xl leading-relaxed max-w-md">
                                Receba as estratégias de crescimento mais eficientes diretamente na sua caixa de entrada. Sem spam, apenas valor.
                            </p>
                        </div>

                        <div className="relative">
                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-primary/10 rounded-full flex items-center justify-center text-green-primary mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Quase lá!</h3>
                                    <p className="text-gray-500">Enviamos um e-mail de confirmação para você. Confira sua caixa de entrada!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 group/input">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Seu melhor e-mail"
                                            className="w-full h-14 sm:h-16 bg-black-base/50 border border-white/10 rounded-2xl sm:rounded-r-none px-6 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-primary/50 transition-all group-hover/input:border-white/20"
                                        />
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="h-14 sm:h-16 px-6 sm:px-8 bg-green-primary text-black-base rounded-2xl sm:rounded-l-none sm:rounded-r-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shrink-0"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-black-base/30 border-t-black-base rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    INSCREVER
                                                    <Send size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-center text-xs text-gray-600">
                                        Ao se inscrever, você concorda com nossa <a href="https://www.growmate.io/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-primary transition-colors">Política de Privacidade</a>.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex flex-col gap-2">
                        <Link href="https://www.growmate.io" className="flex items-center space-x-2">
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                Growmate
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-500">
                            © 2026 Growmate. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

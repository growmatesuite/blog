import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black-base/70 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="https://www.growmate.io" className="flex items-center space-x-2">
                    <span className="text-xl font-bold font-heading text-white">
                        Growmate
                    </span>
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
                    <Link href="/blog" className="transition-colors hover:text-white">
                        Blog
                    </Link>
                </nav>
            </div>
        </header>
    );
}

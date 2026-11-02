import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Bot, Search } from "lucide-react";
import Logo from "@/assets/logo/DuniaLogo.png"
import Image from "next/image";

function Header() {
    return (
        <header className="flex h-14 shrink-0 items-center justify-between bg-black px-4">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white">
                    <ShopifyMark />
                </div>
            </div>

            <div className="flex flex-1 justify-center px-8">
                <div className="relative w-full max-w-xl">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        placeholder="Search"
                        className="h-9 border-neutral-700 bg-neutral-900 pl-9 pr-16 text-neutral-200 placeholder:text-neutral-500 focus-visible:ring-neutral-600"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-400">
                        CTRL <span className="font-medium">K</span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="rounded-md p-1.5 text-neutral-300 hover:bg-neutral-800">
                    <Bot className="h-5 w-5" />
                </button>
                <button className="rounded-md p-1.5 text-neutral-300 hover:bg-neutral-800">
                    <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 rounded-full bg-neutral-900 py-1 pl-1 pr-3">
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-fuchsia-600 text-[10px] text-white">
                            AAS
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-neutral-200">AI Amara shop</span>
                </div>
            </div>
        </header>
    )
}

function ShopifyMark() {
    return (
        <div className="flex items-center gap-1.5">
            {/* <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white"
                fill="currentColor"
            >
                <path d="M15.8 3.6c-.1-.1-.3-.1-.4-.1-.1 0-1 .3-1 .3s-.7-.7-.8-.8c-.1-.1-.2-.1-.4-.1-.2.1-.6.2-1.1.4C11.6 2.7 11 2.5 10.6 2.5c-1 0-2 .7-2.6 2.6-.4 1.3-.6 2.6-.7 3.3l-1.9.6c-.6.2-.6.2-.6.7C4.7 10.3 3.5 19 3.5 19l10.6 2 5.9-1.3s-4-15.7-4.1-15.9c0-.1-.1-.2-.1-.2M13.5 5c0 .1-1.5.5-1.5.5.3-1.1.8-1.6 1.3-1.9.1.4.2.9.2 1.4M11.7 3.4c.1 0 .3.1.4.1-.5.3-1.1.8-1.4 1.9l-1.2.4c.3-1.4 1.1-2.3 2.2-2.4M10.5 3.6c.2 0 .4 0 .5.1-.9.4-1.9 1.4-2.3 3.2l-1.1.3c.4-1.9 1.5-3.4 2.9-3.6" />
            </svg>
            <span className="font-semibold text-white">shopify</span> */}
            <Image src={Logo} width={200} alt="Dunia Logo" />
        </div>
    );
}

export default Header;
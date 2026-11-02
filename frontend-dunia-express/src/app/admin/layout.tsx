import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen w-full flex-col bg-white text-sm text-neutral-900">
            {/* Top bar */}
            <Header />
            <div className="flex min-h-0 flex-1">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <main className="flex-1 overflow-y-auto bg-bg-admin">
                    {children}
                </main>
            </div>
        </div>
    );
}
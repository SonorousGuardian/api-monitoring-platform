import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "API Monitoring Platform",
    description: "Observability for Microservices",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
                <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
                    <div className="container mx-auto flex h-16 items-center px-4">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            API Monitor
                        </h1>
                        <div className="ml-8 flex space-x-4">
                            <a href="/" className="hover:text-blue-400 transition-colors">Dashboard</a>
                            <a href="/explorer" className="hover:text-blue-400 transition-colors">Explorer</a>
                            <a href="/issues" className="hover:text-blue-400 transition-colors">Issues</a>
                        </div>
                    </div>
                </nav>
                <main className="container mx-auto p-4 md:p-8">
                    {children}
                </main>
            </body>
        </html>
    );
}

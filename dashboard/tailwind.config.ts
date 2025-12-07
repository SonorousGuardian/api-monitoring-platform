import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#3b82f6",
                secondary: "#64748b",
                accent: "#f59e0b",
                danger: "#ef4444",
                success: "#22c55e",
            },
        },
    },
    plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "rgba(var(--background))",
                border: "rgba(var(--border))",
                "text-bold": "rgba(var(--text-bold))",
                "text-light": "rgba(var(--text-light))",
                "background-secondary": "rgba(var(--background-secondary))",
                active: "rgba(var(--active))",
            },
        },
    },
    plugins: [],
};

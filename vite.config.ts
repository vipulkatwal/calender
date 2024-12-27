import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					charts: ["chart.js", "react-chartjs-2"],
					calendar: ["@fullcalendar/core", "@fullcalendar/react"],
				},
			},
		},
	},
});

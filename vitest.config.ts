import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["test/**/*.test.ts"],
		reporters: ["default", "./reporters/log-collector.ts"],
		browser: {
			enabled: true,
			headless: false,
			provider: webdriverio({
				capabilities: {
					"moz:firefoxOptions": {
						args: [],
						prefs: {
							// Enable WebGL
							"webgl.disabled": false,
							"webgl.force-enabled": true,

							// Allow hardware acceleration
							"gfx.webrender.all": true,
							"gfx.webrender.compositor": true,
							"gfx.webrender.enabled": true,
							"layers.acceleration.force-enabled": true,
						},
					},
				},
			}),
			instances: [
				{ browser: "chrome", name: "Chrome" },
				{ browser: "firefox", name: "Firefox" },
				{ browser: "safari", name: "Safari" },
			],
		},
		coverage: {
			enabled: true,
			provider: "istanbul",
			reporter: ["text", "lcov", "html"],
			include: ["src/**/*.ts"],
			exclude: ["**/*.test.ts", "**/*.spec.ts"],
		},
	},
});

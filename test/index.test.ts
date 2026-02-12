import { assert, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import * as logger from "./test-logger";

describe("Browser Tests", () => {
	// Detect browser name from user agent
	const ua = navigator.userAgent;
	const browserName = ua.includes("Firefox")
		? "firefox"
		: ua.includes("Chrome") && !ua.includes("Edg")
			? "chrome"
			: ua.includes("Safari") && !ua.includes("Chrome")
				? "safari"
				: "unknown";

	const frame = () => new Promise(requestAnimationFrame);

	it("should have window object available", () => {
		expect(window).toBeDefined();
		expect(window.location).toBeDefined();
	});

	it("should be able to manipulate DOM", () => {
		const div = document.createElement("div");
		div.textContent = "Hello, world!";
		document.body.appendChild(div);

		expect(document.querySelector("div")?.textContent).toBe("Hello, world!");

		// Clean up
		div.remove();
	});

	it("should support matchMedia with viewport resizing", async () => {
		// Test mobile viewport
		await page.viewport(375, 667);
		await frame();

		const mobileQuery = window.matchMedia("(max-width: 768px)");
		expect(mobileQuery.matches).toBe(true);

		const desktopQuery = window.matchMedia("(min-width: 1024px)");
		expect(desktopQuery.matches).toBe(false);

		// Test desktop viewport
		await page.viewport(1920, 1080);
		await frame();

		const mobileQueryAfterResize = window.matchMedia("(max-width: 768px)");
		expect(mobileQueryAfterResize.matches).toBe(false);

		const desktopQueryAfterResize = window.matchMedia("(min-width: 1024px)");
		expect(desktopQueryAfterResize.matches).toBe(true);

		// Test tablet viewport
		await page.viewport(768, 1024);
		await frame();

		const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1024px)");
		expect(tabletQuery.matches).toBe(true);
	});

	it("should render WebGL in OffscreenCanvas and screenshot", async (ctx) => {
		logger.setCurrentTest(ctx, browserName);

		const canvas = new OffscreenCanvas(256, 256);
		const gl = canvas.getContext("webgl");

		logger.info("WebGL context:", gl ? "available" : "not available");

		assert(gl, "WebGL context not available");

		const renderer = gl.getParameter(gl.RENDERER);

		logger.info("WebGL Renderer:", renderer);

		// Clear to red
		gl.clearColor(1, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Convert to blob and create image
		const blob = await canvas.convertToBlob();
		const src = URL.createObjectURL(blob);
		const img = Object.assign(document.createElement("img"), { src });
		img.setAttribute("data-testid", "webgl-canvas");

		// Append the image to the page
		document.body.append(img);

		// Wait for image to load
		await new Promise((resolve) => (img.onload = resolve));
		await frame();

		// Screenshot just the image element with browser-specific filename
		const screenshot = await page.getByTestId("webgl-canvas").screenshot({
			path: `webgl-offscreen-${browserName}.png`,
		});

		expect(screenshot).toBeDefined();

		// Clean up the image
		img.remove();
		URL.revokeObjectURL(src);
	});
});

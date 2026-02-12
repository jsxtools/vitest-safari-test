# Vitest Safari Test

[![Tests](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jsxtools/vitest-safari-test/badges/tests.json)](https://github.com/jsxtools/vitest-safari-test/actions)
[![Coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/jsxtools/vitest-safari-test/badges/coverage.json)](https://github.com/jsxtools/vitest-safari-test/actions)
[![npm version](https://img.shields.io/npm/v/@jsxtools/vitest-safari-test.svg)](https://www.npmjs.com/package/@jsxtools/vitest-safari-test)
[![License](https://img.shields.io/badge/license-MIT--0-blue.svg)](LICENSE)

> Testing Vitest integration with Safari browser using WebDriverIO

## Features

- 🧪 Run Vitest tests in real browsers: **Chrome**, **Firefox**, and **Safari**
- 🔧 Uses WebDriverIO provider for Safari compatibility
- ✅ Tests modern JavaScript features across all browsers
- 🎯 DOM manipulation and browser API testing
- 📸 Screenshot testing with WebGL and OffscreenCanvas
- 📱 Viewport resizing and matchMedia testing

## Prerequisites

- **macOS only** - Safari browser testing only works on macOS
- **Safari** - Comes pre-installed on macOS
- **safaridriver** - Comes with macOS (located at `/usr/bin/safaridriver`)
- **Enable Remote Automation** in Safari:
  1. Open Safari
  2. Go to Safari → Settings (or Preferences)
  3. Click on "Advanced" tab
  4. Check "Show features for web developers" (or "Show Develop menu in menu bar")
  5. Go to Develop → Allow Remote Automation

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run tests in all browsers (Chrome, Firefox, Safari)
npm test

# Run tests and auto-refocus terminal when done (recommended for local development)
npm run test:refocus

# Run tests in watch mode
npm run test:watch
```

All three browsers will launch automatically (non-headless) and run your tests!

**Note:** Safari will steal window focus during tests. Use `npm run test:refocus` to automatically return focus to your terminal/editor when tests complete.

## How It Works

This project demonstrates how to run Vitest tests in real browsers using WebDriverIO:

1. **WebDriverIO Provider** - Uses `@vitest/browser-webdriverio` instead of Playwright
2. **Multi-Browser Testing** - Runs tests in Chrome, Firefox, and Safari
3. **Safari Support** - Configured to use Safari via `safaridriver` (macOS only)
4. **Non-Headless** - Safari doesn't support headless mode via WebDriver
5. **Real Browser Testing** - Tests run in actual browsers, not WebKit builds

## Test Examples

The project includes several browser-specific tests:

- **DOM Manipulation** - Creating and querying DOM elements
- **matchMedia with Viewport Resizing** - Testing responsive behavior at different viewport sizes (mobile, tablet, desktop)
- **WebGL in OffscreenCanvas** - Rendering WebGL graphics off the main thread and capturing screenshots
- **Browser-Specific Screenshots** - Taking screenshots with unique filenames per browser using `navigator.userAgent`

## Configuration

The key configuration in `vitest.config.ts`:

```typescript
import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["test/**/*.test.ts"],
		browser: {
			enabled: true,
			headless: false, // Safari doesn't support headless via WebDriver
			provider: webdriverio(),
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
```

## Troubleshooting

### Safari steals window focus

This is a known limitation of Safari WebDriver - it doesn't support running in the background.

**Solutions:**

1. Use `npm run test:refocus` to automatically return focus to your terminal/editor after tests complete
2. Use macOS Mission Control to create a separate desktop for browser testing
3. Run tests only in CI/CD environments where window focus doesn't matter

### Safari doesn't launch

1. Check if `safaridriver` is available:
   ```bash
   which safaridriver
   # Should output: /usr/bin/safaridriver
   ```

2. Verify Safari version:
   ```bash
   /Applications/Safari.app/Contents/MacOS/Safari --version
   ```

3. Make sure "Allow Remote Automation" is enabled in Safari's Develop menu

### "Session not created" errors

- Ensure "Allow Remote Automation" is checked in Safari → Develop menu
- Try restarting Safari
- Check that no other automation tools are using Safari

### Tests fail in Safari but pass in other browsers

- Safari may have different JavaScript feature support
- Check the browser console for specific errors
- Verify that the features you're testing are supported in Safari

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

## Key Differences from Playwright

- **WebDriverIO** is used instead of Playwright because Safari support via WebDriver is more reliable
- **Non-headless** - Safari doesn't support headless mode via WebDriver
- **Slower** - WebDriver protocol is slower than Playwright's native protocol
- **Real Safari** - Tests run in actual Safari, not a WebKit build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT-0](LICENSE) - Public Domain Equivalent

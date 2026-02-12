import type { Reporter, TestModule } from "vitest/node";

interface LogEntry {
	testName: string;
	testFile: string;
	browser?: string;
	logs: Array<{ type: string; content: string }>;
}

export default class LogCollectorReporter implements Reporter {
	private logs: LogEntry[] = [];

	onTestRunEnd(testModules: ReadonlyArray<TestModule>) {
		// Collect all logs from all test modules
		for (const testModule of testModules) {
			this.collectLogsFromModule(testModule);
		}

		// Print collected logs
		this.printLogs();
	}

	private collectLogsFromModule(testModule: TestModule) {
		const filepath = testModule.moduleId;

		// Recursively collect logs from all tasks
		const collectFromTask = (task: any, parentNames: string[] = []) => {
			if (task.type === "test") {
				const fullName = [...parentNames, task.name].join(" > ");
				const logs: Array<{ type: string; content: string }> = [];

				// Get meta and result (they might be functions)
				const meta = typeof task.meta === "function" ? task.meta() : task.meta;
				const result = typeof task.result === "function" ? task.result() : task.result;

				// Collect logs from task.meta.logs (custom logger)
				if (meta?.logs && Array.isArray(meta.logs)) {
					for (const log of meta.logs) {
						const content = log.data !== undefined ? `${log.message} ${this.formatLogContent(log.data)}` : log.message;
						logs.push({
							type: log.type || "log",
							content,
						});
					}
				}

				// Also try to collect from task.result.logs (standard console output)
				if (result?.logs) {
					for (const log of result.logs) {
						logs.push({
							type: log.type || "log",
							content: this.formatLogContent(log.content || log),
						});
					}
				}

				// Only add if there are logs
				if (logs.length > 0) {
					this.logs.push({
						testName: fullName,
						testFile: filepath,
						browser: this.getBrowserName(task),
						logs,
					});
				}
			}

			// Recursively process children
			if (task.children) {
				const newParentNames = task.type === "suite" ? [...parentNames, task.name] : parentNames;
				for (const child of task.children) {
					collectFromTask(child, newParentNames);
				}
			}
		};

		// Start collecting from the module's children
		for (const child of testModule.children) {
			collectFromTask(child);
		}
	}

	private getBrowserName(task: any): string | undefined {
		// Try to extract browser name from task meta
		return task.meta?.browser || task.projectName;
	}

	private formatLogContent(content: unknown): string {
		if (typeof content === "string") {
			return content;
		}
		if (content === null) {
			return "null";
		}
		if (content === undefined) {
			return "undefined";
		}
		if (typeof content === "object") {
			try {
				return JSON.stringify(content, null, 2);
			} catch {
				return String(content);
			}
		}
		return String(content);
	}

	private printLogs() {
		if (this.logs.length === 0) {
			return;
		}

		console.log("\n");
		console.log("=".repeat(80));
		console.log("COLLECTED LOGS");
		console.log("=".repeat(80));

		// Group logs by file and browser
		const grouped = this.groupLogsByFileAndBrowser();

		for (const [fileKey, browsers] of grouped) {
			console.log(`\n📄 ${fileKey}`);

			for (const [browser, tests] of browsers) {
				if (browser) {
					console.log(`  🌐 ${browser}`);
				}

				for (const test of tests) {
					console.log(`    ✓ ${test.testName}`);

					for (const log of test.logs) {
						const prefix = this.getLogPrefix(log.type);
						console.log(`      ${prefix} ${log.content}`);
					}
				}
			}
		}

		console.log("\n" + "=".repeat(80));
		console.log("\n");
	}

	private groupLogsByFileAndBrowser(): Map<string, Map<string | undefined, LogEntry[]>> {
		const grouped = new Map<string, Map<string | undefined, LogEntry[]>>();

		for (const entry of this.logs) {
			if (!grouped.has(entry.testFile)) {
				grouped.set(entry.testFile, new Map());
			}

			const fileGroup = grouped.get(entry.testFile)!;
			if (!fileGroup.has(entry.browser)) {
				fileGroup.set(entry.browser, []);
			}

			fileGroup.get(entry.browser)!.push(entry);
		}

		return grouped;
	}

	private getLogPrefix(type: string): string {
		switch (type) {
			case "stdout":
			case "log":
				return "📝";
			case "stderr":
			case "error":
				return "❌";
			case "warn":
				return "⚠️";
			case "info":
				return "ℹ️";
			case "debug":
				return "🐛";
			default:
				return "📋";
		}
	}
}

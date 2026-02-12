import type { TaskMeta, TestContext } from "vitest";

export interface TestLog {
	type: "log" | "info" | "warn" | "error" | "debug";
	message: string;
	data?: unknown;
	timestamp: number;
}

// Store reference to current test's meta object
let currentTaskMeta: TaskMeta & { browserName?: string; logs?: TestLog[] };

export function setCurrentTest(ctx: TestContext, browserName: string): void {
	currentTaskMeta = ctx.task.meta;

	// Initialize browser name in task meta
	if (!currentTaskMeta.browserName) {
		currentTaskMeta.browserName = browserName;
	}

	// Initialize logs array in task meta
	if (!currentTaskMeta.logs) {
		currentTaskMeta.logs = [];
	}
}

export function log(message: string, data?: unknown): void {
	addLog("log", message, data);
}

export function info(message: string, data?: unknown): void {
	addLog("info", message, data);
}

export function warn(message: string, data?: unknown): void {
	addLog("warn", message, data);
}

export function error(message: string, data?: unknown): void {
	addLog("error", message, data);
}

export function debug(message: string, data?: unknown): void {
	addLog("debug", message, data);
}

function addLog(type: TestLog["type"], message: string, data?: unknown): void {
	const logEntry: TestLog = {
		type,
		message: `[${type.toUpperCase()}:${currentTaskMeta.browserName}] ${message}`,
		data,
		timestamp: Date.now(),
	};

	// Store in task meta so the reporter can access it
	if (currentTaskMeta?.logs && Array.isArray(currentTaskMeta.logs)) {
		(currentTaskMeta.logs as TestLog[]).push(logEntry);
	}
}

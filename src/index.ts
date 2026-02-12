/**
 * Example function demonstrating TypeScript best practices.
 * Replace this with your actual implementation.
 *
 * @param value - The input value to process
 * @returns The processed result
 */
export function exampleFunction(value: string): string {
	if (!value) {
		throw new Error("Value cannot be empty");
	}

	return value.toUpperCase();
}

/**
 * Example class demonstrating TypeScript best practices.
 * Replace this with your actual implementation.
 */
export class ExampleClass {
	private readonly data: string;

	constructor(initialData: string) {
		this.data = initialData;
	}

	/**
	 * Gets the stored data.
	 */
	getData(): string {
		return this.data;
	}

	/**
	 * Processes the stored data.
	 */
	process(): string {
		return exampleFunction(this.data);
	}
}

/**
 * Empty module stub for Node.js modules in browser environment
 * This provides empty implementations for Node-specific functionality.
 */

// TypeScript type for process object
interface SpawnResult {
	on: (event: string, callback: () => void) => void;
	stdout: { on: (event: string, callback: () => void) => void };
	stderr: { on: (event: string, callback: () => void) => void };
}

// Export an empty spawn function
export const spawn = (): SpawnResult => {
	console.warn('Node.js spawn is not available in browser environment');
	return {
		on: () => {},
		stdout: { on: () => {} },
		stderr: { on: () => {} },
	};
};

// Default export for the module
export default {
	spawn,
};

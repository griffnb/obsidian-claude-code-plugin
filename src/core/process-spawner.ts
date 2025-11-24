import { spawn, ChildProcess, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration for spawning Claude Code process
 */
export interface SpawnConfig {
    claudePath: string;
    args: string[];
    workingDir: string;
}

/**
 * Handles spawning and managing Claude Code process
 */
export class ProcessSpawner {
    /**
     * Get environment variables as if running in a login shell
     * This loads variables from .zshrc, .bash_profile, etc.
     */
    private static getShellEnvironment(): Record<string, string> {
        try {
            // Determine which shell to use
            const shell = process.env.SHELL || '/bin/zsh';
            
            // Run the shell in login mode and dump the environment
            // This will source ~/.zshrc, ~/.bash_profile, etc.
            const envOutput = execSync(`${shell} -l -c 'env'`, {
                encoding: 'utf8',
                maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large environments
                timeout: 5000 // 5 second timeout
            });

            // Parse the environment output into a key-value object
            const env: Record<string, string> = {};
            envOutput.split('\n').forEach((line: string) => {
                const idx = line.indexOf('=');
                if (idx > 0) {
                    const key = line.substring(0, idx);
                    const value = line.substring(idx + 1);
                    env[key] = value;
                }
            });

            return env;
        } catch (error) {
            // Fallback to process.env if shell environment loading fails
            return { ...process.env } as Record<string, string>;
        }
    }

    /**
     * Find node executable in the shell environment
     */
    private static findNodePath(shellEnv: Record<string, string>): string {
        // Try to find node in PATH from the shell environment
        const pathDirs = (shellEnv.PATH || '').split(':').filter(dir => dir);
        
        for (const dir of pathDirs) {
            const nodePath = path.join(dir, 'node');
            if (fs.existsSync(nodePath)) {
                try {
                    // Check if it's executable
                    fs.accessSync(nodePath, fs.constants.X_OK);
                    return nodePath;
                } catch (e) {
                    // Not executable, continue searching
                }
            }
        }
        
        // Fallback: try to find it via which command
        try {
            const whichResult = execSync('which node', { 
                encoding: 'utf8',
                env: shellEnv 
            }).trim();
            if (whichResult && fs.existsSync(whichResult)) {
                return whichResult;
            }
        } catch (e) {
            // which failed, continue to last resort
        }
        
        // Last resort: use 'node' and let the system find it
        return 'node';
    }

    /**
     * Spawn Claude Code process with enhanced environment
     *
     * @param config Spawn configuration
     * @returns Child process
     */
    static spawn(config: SpawnConfig): ChildProcess {
        // Get full shell environment (includes all your terminal env vars)
        const shellEnv = this.getShellEnvironment();

        const options = {
            cwd: config.workingDir,
            env: shellEnv,
            shell: false
        };

        // Find node executable
        const nodePath = this.findNodePath(shellEnv);

        // Resolve claudePath to absolute path
        // If it starts with ~, expand to home directory
        // If it's not absolute, try to resolve it via PATH or make it absolute
        let resolvedClaudePath = config.claudePath;
        if (resolvedClaudePath.startsWith('~')) {
            resolvedClaudePath = resolvedClaudePath.replace('~', shellEnv.HOME || '');
        }

        // If it's not an absolute path, try to find it in PATH
        if (!path.isAbsolute(resolvedClaudePath)) {
            // Check if it's a command name (like "claude")
            // Try to find it in PATH from shell environment
            const pathDirs = (shellEnv.PATH || '').split(':');

            for (const dir of pathDirs) {
                const fullPath = path.join(dir, resolvedClaudePath);
                if (fs.existsSync(fullPath)) {
                    resolvedClaudePath = fullPath;
                    break;
                }
            }
        }

        const finalArgs = [resolvedClaudePath, ...config.args];

        return spawn(nodePath, finalArgs, options);
    }

    /**
     * Send stdin input to process
     *
     * @param process Child process
     * @param prompt Prompt to send
     */
    static sendInput(process: ChildProcess, prompt: string): void {
        if (process.stdin) {
            const inputMessage = {
                type: 'user',
                message: {
                    role: 'user',
                    content: prompt
                }
            };

            const jsonInput = JSON.stringify(inputMessage) + '\n';
            process.stdin.write(jsonInput);
            process.stdin.end();
        }
    }
}

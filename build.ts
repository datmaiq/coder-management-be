import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

const build = async () => {
  try {
    // Step 1: Clean the 'dist' directory
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      fs.rmdirSync(distPath, { recursive: true });
      console.log('Cleaned the dist directory.');
    }

    // Step 2: Compile TypeScript files
    console.log('Compiling TypeScript files...');
    await execAsync('tsc --project tsconfig.json');
    console.log('Compilation completed successfully.');

    // Additional steps (if any) can be added here
  } catch (error) {
    console.error('Error during build:', error);
  }
};

build();
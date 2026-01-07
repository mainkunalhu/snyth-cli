import fs from 'node:fs/promises';
import path from 'node:path';

const pwdPath = process.cwd();

export async function createFile(relativePath: string, fileName: string, data: string) {
  const finalPath = path.join(pwdPath, relativePath, fileName);
  try {
    const dir = path.dirname(finalPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(finalPath, data, 'utf-8');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create file at ${finalPath}: ${error.message}`);
    }
    return false;
  }
}

export async function createFolder(relativePath: string) {
  const finalPath = path.join(pwdPath, relativePath);
  try {
    await fs.mkdir(finalPath, { recursive: true });
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create folder at ${finalPath}: ${error.message}`);
    }
    return false;
  }
}

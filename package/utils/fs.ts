import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { SnythConfig } from '../types/types';

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

export function exists(relativePath: string): boolean {
  return existsSync(path.join(pwdPath, relativePath));
}

export async function readConfig(): Promise<SnythConfig> {
  const configPath = path.join(pwdPath, 'snyth.config.json');

  if (!exists('snyth.config.json')) {
    throw new Error(
      "Configuration file 'snyth.config.json' not found. Run 'snyth init' to get started."
    );
  }

  try {
    const data = await fs.readFile(configPath, 'utf-8');
    const parsedConfig: SnythConfig = JSON.parse(data);
    return parsedConfig;
  } catch (error) {
    throw new Error(
      `Failed to read config: ${error instanceof Error ? error.message : 'Invalid JSON format'}`
    );
  }
}

export async function updateConfigComponents(componentName: string) {
  const configPath = path.join(pwdPath, 'snyth.config.json');
  const config = await readConfig();

  if (!config.components.includes(componentName)) {
    config.components = [...config.components, componentName];

    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
  }
}

export async function removeFromConfig(componentNames: string[]) {
  const configPath = path.join(process.cwd(), 'snyth.config.json');
  const config = await readConfig();

  const namesToRemove = componentNames.map((n) => n.toLowerCase());

  config.components = config.components.filter(
    (c: string) => !namesToRemove.includes(c.toLowerCase())
  );

  await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export async function deleteFile(relativePath: string, fileName: string) {
  const finalPath = path.join(pwdPath, relativePath, fileName);
  try {
    if (existsSync(finalPath)) {
      await fs.unlink(finalPath);
      return true;
    }
    return false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete ${fileName}: ${error.message}`);
    }
    return false;
  }
}

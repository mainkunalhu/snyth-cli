import { BASE_URL_MOBILE, BASE_URL_WEB } from '../contants/index';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import { readConfig } from '../utils/fs';
import type { ListType } from '../types/types';

export const listCommand = new Command('list')
  .description('List all available components of snyth.')
  .action(async function () {
    const s = p.spinner();

    try {
      s.start('Fetching available components');
      const config = await readConfig();
      const baseUrl = config.projectType === 'react' ? BASE_URL_WEB : BASE_URL_MOBILE;

      const response = await fetch(`${baseUrl}/list.json`);

      if (!response.ok) {
        throw new Error('Could not reach the registry.');
      }

      const data: ListType = await response.json();
      s.stop('Registry synchronized');

      if (!data.components || data.components.length === 0) {
        p.log.info('No components found in the registry.');
        return;
      }

      const header = `${'component'.padEnd(20)} status`;
      const separator = `${'-'.repeat(30)}`;

      const items = data.components.map((componentName) => {
        const normalizedName = componentName.toLowerCase();

        const isInstalled = config.components.some((c) => c.toLowerCase() === normalizedName);

        const status = isInstalled ? 'installed' : '-';

        return `${normalizedName.padEnd(20)} ${status}`;
      });

      const output = [header, separator, ...items].join('\n');

      p.note(output, `snyth registry: ${config.projectType.toLowerCase()}`);
    } catch (error) {
      s.stop('Failed to load components');
      p.log.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  });

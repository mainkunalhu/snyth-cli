import { BASE_URL_MOBILE, BASE_URL_WEB } from '../contants/index';
import { Command } from 'commander';
import * as p from '@clack/prompts';
import { createFile, readConfig, updateConfigComponents } from '../utils/fs';
import type { ComponentType } from '../types/types';

export const addCommand = new Command('add')
  .description('Add components to your project')
  .argument('[component]', 'The name of the component to add')
  .action(async function (componentArg) {
    const s = p.spinner();

    try {
      s.start('Reading snyth.config.json');
      const config = await readConfig();

      if (config.components.includes(componentArg)) {
        s.stop('Check skipped.');
        p.log.warn(`Component "${componentArg}" is already installed in your project.`);
        return;
      }

      const baseUrl = config.projectType === 'react' ? BASE_URL_WEB : BASE_URL_MOBILE;
      let fileName = '';
      let code = '';

      s.message(`Fetching "${componentArg}" data...`);

      const response = await fetch(baseUrl + `${componentArg}.json`, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Failed to reach the registry. Server responded with ${response.status}`);
      }

      const data: ComponentType = await response.json();

      if (config.ts) {
        fileName = data.fileName.ts;
        code = data.language.ts;
      } else {
        fileName = data.fileName.js;
        code = data.language.js;
      }

      s.message(`Generating ${fileName}...`);
      await createFile(config.dir, fileName, code);
      await updateConfigComponents(data.name);
      s.stop(`${data.name} installed successfully!`);

      const dependencyList =
        data.dependencies.length > 0
          ? `\n\nRequired dependencies: ${data.dependencies.join(', ')}\n\nPlease make sure to install these dependencies.`
          : '';

      p.note(`Location: ${config.dir}/${fileName}${dependencyList}`, 'Installation Complete');
    } catch (error) {
      s.stop('Installation failed.');
      p.log.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  });

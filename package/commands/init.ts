import { Command } from 'commander';
import * as p from '@clack/prompts';
import { createFile, createFolder } from '../utils/fs';

export const initCommand = new Command('init')
  .description('Initialize the Snyth configuration in your project')
  .action(async function () {
    p.intro(' SNYTH INITIALIZATION ');

    const projectSetup = await p.group(
      {
        projectType: () =>
          p.select({
            message: 'Select your project type:',
            options: [
              { value: 'expo', label: 'Expo', hint: 'Recommended for Mobile' },
              { value: 'rn', label: 'Bare React Native' },
            ],
          }),
        ts: () =>
          p.confirm({
            message: 'Will you be using TypeScript?',
            initialValue: true,
          }),
        mode: () =>
          p.select({
            message: 'Select your preferred theme mode:',
            options: [
              { value: 'dark', label: 'Dark Mode' },
              { value: 'light', label: 'Light Mode' },
              { value: 'both', label: 'Both (System preference)' },
            ],
          }),
        dir: () =>
          p.text({
            message: 'Where should we install your components?',
            placeholder: './src/components/snyth',
            initialValue: './src/components/snyth',
          }),
      },
      {
        onCancel: () => {
          p.cancel('Setup cancelled.');
          process.exit(0);
        },
      }
    );

    const s = p.spinner();

    s.start('Setting up project structure...');

    const folderCreated = await createFolder(projectSetup.dir);

    const finalConfig = {
      version: '1.0.0',
      ...projectSetup,
      components: [],
      createdAt: new Date().toISOString(),
    };

    const fileCreated = await createFile(
      '',
      'snyth.config.json',
      JSON.stringify(finalConfig, null, 2)
    );

    await new Promise((res) => setTimeout(res, 800));

    if (fileCreated && folderCreated) {
      s.stop('Project structure and config generated!');

      p.log.step(`Created component directory at: ${projectSetup.dir}`);

      p.outro('Snyth has been initialized successfully!');
    } else {
      s.stop('Setup encountered an issue.', 1);
      if (!folderCreated) p.log.error(`Could not create folder at ${projectSetup.dir}`);
      if (!fileCreated) p.log.error('Could not write snyth.config.json');
      p.outro('Please check your folder permissions.');
    }
  });

import { Command } from 'commander';
import * as p from '@clack/prompts';
import { readConfig, deleteFile, removeFromConfig } from '../utils/fs';

export const removeCommand = new Command('remove')
  .description('Remove components from your project')
  .argument('<components...>', 'Names of components to remove')
  .action(async function (components: string[]) {
    const s = p.spinner();

    try {
      s.start('Preparing removal');
      const config = await readConfig();

      const successList: string[] = [];
      const extension = config.ts ? 'tsx' : 'jsx';

      for (const name of components) {
        const fileName = `${name.toLowerCase()}.${extension}`;

        s.message(`Deleting ${fileName}...`);

        const isDeleted = await deleteFile(config.dir, fileName);

        if (isDeleted) {
          successList.push(name);
        }
      }

      if (successList.length > 0) {
        await removeFromConfig(successList);
        s.stop('Removal complete');
        p.log.success(`Successfully removed: ${successList.join(', ')}`);
      } else {
        s.stop('Finished');
        p.log.warn('No matching files were found to delete.');
      }
    } catch (error) {
      s.stop('Process failed');
      p.log.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  });

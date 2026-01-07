/*

Todo:
    initailize the file snyth.config.ts
    
*/

import { Command } from 'commander';

export const initCommand = new Command('init')
  .description('Initailize the Snyth Project inside your project')
  .action(function () {});

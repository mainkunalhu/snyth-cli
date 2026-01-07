#!/usr/bin/env node

import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { Colors } from './contants';
import { Command } from 'commander';
import { initCommand } from './commands';

function starter() {
  const title = figlet.textSync('SNYTH', {
    font: 'Standard',
    horizontalLayout: 'fitted',
  });

  const snythGradient = gradient([Colors.primary, '#F2B8A2', Colors.text]);

  const banner = boxen(snythGradient(title), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: Colors.primary,
    textAlignment: 'center',
    title: 'v1.0.0',
    titleAlignment: 'right',
  });

  console.log(banner);
}

const program = new Command();
async function cmd() {
  program.name('snyth').description('CLI to manage Snyth UI components').version('1.0.0');

  program.addCommand(initCommand);
}

starter();
cmd();

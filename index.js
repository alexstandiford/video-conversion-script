#!/usr/bin/env node

const MultiFileConverter = require('./lib/MultiFileConverter');

/**
 * Allows us to run this script as a cli command
 */
const program = require('commander');

/**
 * Sets up the command to run from the cli
 */
program
  .version('0.1.0')
  .description('Convert Video Files From a Directory');

program
  .command('run')
  .description('Converts the files in the files-to-convert directory of this project')
  .action(() =>{
    const converter = new MultiFileConverter();
    return converter.runConverter();
  });

/**
 * Sets up the command to run from the cli
 */
program
  .command('screenshots')
  .description('Gets a screenshot of each video')
  .action(() =>{
    const converter = new MultiFileConverter();
    return converter.getScreenshots();
  });

/**
 * Sets up the command to run from the cli
 */
program
  .command('videos')
  .description('Gets conversions of each video')
  .action(() =>{
    const converter = new MultiFileConverter();
    return converter.getVideos();
  });

program.parse(process.argv);
#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import FastGlob from 'fast-glob';

import { loadTemplate, replaceData, readConfig } from './src/importer.js';
import { build } from './src/esbuild.js';

const argv = yargs(hideBin(process.argv)).argv;

const defaultConfig = {
  glob: ['*.js'],
  outfile: 'index.js',
  banner: '',
  defaultCategory: {
    slug: 'default',
    title: 'Default',
  },
};


const config = await readConfig(process.cwd(), defaultConfig);

const entries = await FastGlob(config.glob, { 
  cwd: process.cwd() + '/' + config.src_folder,
});

const template = await loadTemplate();
const templateData = {
  imports: entries.map((entry) => {
    return `import ${entry.replace('.js', '')} from './${config.src_folder}/${entry}';`;
  }).join('\n'),
  objects: entries.map((entry) => {
    return '  ' + entry.replace('.js', '');
  }).join(',\n'),
  categorySlug: config.defaultCategory.slug,
  categoryTitle: config.defaultCategory.title,
};

const entryPoint = replaceData(template, templateData);

const esbuildOptions = {
  stdin: {
    contents: entryPoint,
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: true,
  outfile: `${config.dist_folder}/${config.outfile}`,
  loader: { '.js': 'jsx' },
  jsx: 'transform',
  target: 'es6',
  format: 'cjs',
  external: ['wp'],
  banner: {
    js: config.banner,
  },
};


if (argv._[0] == 'build') {
  console.log('Building');
  await build(esbuildOptions, 'build');
}
else if (argv._[0] == 'watch') {
  console.log('Watching');
  await build(esbuildOptions, 'watch');
}
else {
  console.log('Unknown command');
  process.exit(1);
}
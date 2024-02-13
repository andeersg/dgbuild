import fs from 'fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadTemplate() {
  return await fs.readFile(`${__dirname}/template.js.tpl`, 'utf8');
}

export function replaceData(tpl, data) {
  return tpl.replace(/{{(.*?)}}/g, (match, p1) => {
    return data[p1];
  });
}

export async function readConfig(location, defaultConfig = {}) {
  try {
    const configFile = await fs.readFile(`${location}/dgbuild.config.json`, 'utf8');
    const config = JSON.parse(configFile);
    return Object.assign(defaultConfig, config);
  }
  catch (e) {
    throw new Error('Error reading config file');
  }
}
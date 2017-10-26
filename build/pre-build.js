const fs = require('fs');
const version = require('../package.json').version;
const devEnvFile = './src/environments/environment.ts';
const prodEnvFile = './src/environments/environment.prod.ts';
const apiKey = process.env.PROD_FB_API_KEY;
const projectName = process.env.PROD_PROJ_NAME;
const isProd = process.argv.indexOf('--prod') > 0;
let envFile = devEnvFile;

if (isProd) {
  envFile = prodEnvFile;
  if (!apiKey || !projectName) {
    const message = 'Missing env vars for prod build';
    console.log(message);
    throw new Error(message);
  }
}

fs.readFile(envFile, 'utf8', (err,data) => {
  if (err) {
    console.log(err);
    throw new Error(err);
  }
  const result = data.replace(/PROD_FB_API_KEY/g, apiKey || '')
    .replace(/PROD_PROJ_NAME/g, projectName || '')
    .replace(/0.0.0/g, version);

  fs.writeFile(envFile, result, 'utf8', (err) => {
      if (err) {
      console.log(err);
      throw new Error(err);
      }
  });
});





const fs = require('fs');
const apiKey = process.env.PROD_FB_API_KEY;
const projectName = process.env.PROD_PROJ_NAME;

if (!apiKey || !projectName) {
  const message = 'Missing env vars for firebase prod';
  console.log(message);
  throw new Error(message);
}

fs.readFile('./src/environments/environment.prod.ts', 'utf8', function (err,data) {
  if (err) {
    console.log(err);
    throw new Error(err);
  }
  const result = data.replace(/PROD_FB_API_KEY/g, apiKey)
    .replace(/PROD_PROJ_NAME/g, projectName);

  fs.writeFile('./src/environments/environment.prod.1.ts', result, 'utf8', function (err) {
     if (err) {
      console.log(err);
      throw new Error(err);
     }
  });
});

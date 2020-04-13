#!/usr/bin/env -S node --experimental-modules

import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

import postcssReconnaissance from './plugins/postcss-reconnaissance/index.mjs';
import postcssDeprecate from './plugins/postcss-deprecate/index.mjs';

import postcssScss from 'postcss-scss';

import configuration from 'commander';
import system from './system.mjs';
import glob from 'glob';

function isFile(path){
  return fs.lstatSync(path).isFile();
}
function isDirectory(path){
  return fs.lstatSync(path).isDirectory();
}

function spider(pattern){
  return new Promise(function(ok,no){
    glob(pattern, {}, function (er, files) {
      if(er) return no(er);
      ok(files);
    })
  });
}

configuration
  .name("serserge")
  .usage("[source] options")
  .option('-r, --recursive-off', `Disable recursive mode`)
  .option('-g, --glob <pattern>', `Glob (ex: '*.scss' use single quotes on command line)`, '*.scss')
  .option('-d, --destination <dir>', 'Destination Directory (created if missing)', 'dist')

  .command('deprecate [source]')
  .description('List all features marked deprecate')
  .action(async (source) => {

    processDirectory({
      source,
      readonlyMode:true,
      postcssOptions: {
        syntax: postcssScss,
        parser: postcssScss,
        map: false,
      },
      postcssPlugins:[postcssDeprecate()]
    })

  });





configuration.parse(process.argv);

// if(!configuration.args[0]){
//   console.error('source required');
//   process.exit(1)
// }

//console.log(isFile(configuration.args[0])?'Pointing to a file, debug mode enabled':'');

async function processDirectory({source, readonlyMode, postcssOptions, postcssPlugins}){
  const destination = configuration.destination;
  await fs.promises.mkdir(destination, {recursive:true})
  const sourceDirectory = source;
  const recursive = configuration.recursiveOff?'':'**/';
  const filename = configuration.glob;
  const pattern = path.join(sourceDirectory , recursive , filename);
  const files = (await spider(pattern)).map(source=>[source,path.join(destination,source.replace(new RegExp(`^${sourceDirectory}`),''))])
  //console.log('Found %d files in %s', files.length, source);
  for(let file of files){
    const from = file[0];
    const to = file[1];
    const map = to + '.map';
    await fs.promises.mkdir(path.dirname(to), {recursive:true})
    const input = await fs.promises.readFile(from);
    const result = await system({ input, options:Object.assign({}, {syntax: postcssScss, parser: postcssScss, map: false}, postcssOptions, {from,to}), plugins:postcssPlugins});
    if(readonlyMode){
      await fs.promises.writeFile(to, result.css);
      if ( result.map ) await fs.promises.writeFile(map, result.map);
    }
  };
}



async function processFile({source, readonlyMode, postcssOptions, postcssPlugins}){

  const from = source;
  const input = await fs.promises.readFile(from);
  console.log(chalk.green(input.toString()));
  const result = await system({ input, options:Object.assign({}, {syntax: postcssScss, parser: postcssScss, map: false}, postcssOptions), plugins:postcssPlugins});
}

export default async function main(){
  // const source = configuration.args[0];
  // if(isFile(source)){
  //   await processFile({options, plugins})
  // } else if(isDirectory(source)){
  //   await processDirectory({options, plugins})
  // }
}

// main();

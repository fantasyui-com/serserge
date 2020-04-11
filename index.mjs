#!/usr/bin/env -S node --experimental-modules

import fs from 'fs';
import path from 'path';

import program from 'commander';
import system from './system.mjs';
import glob from 'glob';

function spider(pattern){
  return new Promise(function(ok,no){
    glob(pattern, {}, function (er, files) {
      if(er) return no(er);
      ok(files);
    })
  });
}

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

if (program.debug) console.log(program.opts());
console.log('pizza details:');
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);

export default async function main(){

  const dest = 'dist';
  await fs.promises.mkdir('dist', {recursive:true})

  // const root = 'test-data/bootstrap/';
  // const globs = '/mixins/_buttons.scss';
  // const pattern = root + globs;

  const root = 'test-data/bootstrap';
  const globs = '/**/*.scss';
  const pattern = root + globs;

  const files = await spider(pattern);

  for(let file of files){
    const from = file;

    const cleaned = file.replace(new RegExp(`^${root}`),'')
    const to =  path.join(dest, cleaned);
    const map = to + '.map';
    console.log('Processing [%s]',to);
    await fs.promises.mkdir(path.dirname(to), {recursive:true})

    const input = await fs.promises.readFile(from);
    const result = await system({ input, from, to, map});
    await fs.promises.writeFile(to, result.css);
    if ( result.map ) await fs.promises.writeFile(map, result.map);

  };

  return;



}

main();

import postcss from 'postcss';
import fs from 'fs';
import postcssConfig from './postcss.config.mjs';

export default async function({input, from, to, map}){

  const config = await postcssConfig();

  // NOTE EXAMPLE: const example = postcss.plugin('example', function(){ return function(root, result) { console.log('ROOT',root); console.log('RESULT',result) } });

  const plugins = [].concat(config.plugins);

  const result = await postcss(plugins).process(input, { from, to, syntax: config.syntax, parser: config.parser });

  // console.log(result);

  return result;
}

import chalk from 'chalk';
import postcss from 'postcss';
import fs from 'fs';



function rulePath(rule){
  let result = [];

  let position = rule;
  while(position){
    if(position.type === 'atrule')result.push(position.name + ' ' + position.params)
    position = position.parent;
  }

  return JSON.stringify(result.reverse());
}
function declPath(decl){
  let result = [];

  let position = decl.parent;
  while(position.selector){

    result.push(position.selector)
    // result.push(position.name + ' ' + position.param)

    position = position.parent;
  }

  return JSON.stringify(result.reverse());
}

function payload (root, result) {
    console.log(chalk.green(result.opts.from));
    walkAll(root,0);
}

function identify(node){
  let type = node.type;
  let name = 'Unidentified';

  if(type === 'root'){
      name = node.type;
  } else if(type === 'atrule'){
      name = node.name + ' ' + node.params;
  } else if(type === 'rule'){
      name = node.selector.replace(/\n+/g,'').replace(/ +/g,' ');
  } else if(type === 'comment'){
      name = node.text;
  } else if(type === 'decl'){
      name = node.prop + ': ' + node.value;
  }else{
    console.log(node);
  }
  return `${chalk.yellow(type)}(${chalk.white(name)})`;
}

function walkAll(parent, depth){
  let prefix = '  '.repeat(depth);
  console.log(prefix + identify(parent));
  if(parent.nodes){
    for(let child of parent.nodes){
      walkAll(child, depth + 1);
    }
  }
}


export default function(){
  return postcss.plugin('postcss-reconnaissance', function(){return payload});
}

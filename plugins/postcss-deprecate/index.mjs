import fs from 'fs';
import util from 'util';

import chalk from 'chalk';

import postcss from 'postcss';
import valueParser from 'postcss-value-parser';


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
    walkAll(root,0,result.opts.from);
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

function walkAll(parent, depth, file){

  if( ( parent.type === 'atrule') && ( parent.name == 'include') ){
    const value = valueParser(parent.params);
    const functionNode = value.nodes[0];
    if( functionNode && (functionNode.type === 'function') && (functionNode.value === 'deprecate') ){
        let content = functionNode.nodes.filter(i=>i.value!=',').filter((o,i)=>i<3).map(i=>i.value)
       //console.log(util.inspect(content, { showHidden: true, depth: null }));
       console.log(content.join(' '));

      //console.log(value);
    }
    //   if(value)
    // /// found atrule(include deprecate("The `float-left` mixin", "v4.3.0", "v5"))
    // console.log(file + ": " + identify(parent));
    // //console.log(parsedValue);
    // //console.log(parsedValue.nodes);
    // console.log(util.inspect(parsedValue, { showHidden: true, depth: null }));
  }
  if(parent.nodes){
    for(let child of parent.nodes){
      walkAll(child, depth + 1, file);
    }
  }
}


export default function(){
  return postcss.plugin('postcss-deprecate', function(){return payload});
}

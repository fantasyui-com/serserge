import chalk from 'chalk';
import postcss from 'postcss';
import fs from 'fs';

const remove = {
  'color': true,
  'background-color':true,
  'border-color':true,
  'border-top-color':true,
  'border-bottom-color':true,
  'border-left-color':true,
  'border-right-color':true,
}

const whitelist = {
  'inherit': true,
  'transparent': true,
}

function rulePath(rule){
  let result = [];
  let position = rule;
  while(position){
    if(position.type === 'atrule') result.push(position.name + ' ' + position.params)
    position = position.parent;
  }
  return JSON.stringify(result.reverse());
}

function declPath(decl){
  let result = [];
  let position = decl.parent;
  while(position.selector){
    result.push(position.selector)
    position = position.parent;
  }
  return JSON.stringify(result.reverse());
}

function payload (root, result) {
     walkAll(root, 0);
}

function identify(node){
  let type = node.type;
  let name = 'Unidentified';

  if(type === 'root'){
      name = node.type;
  } else if(type === 'atrule'){
      name = node.name + ' ' + node.params;
  } else if(type === 'rule'){
      name = node.selector;
  } else if(type === 'comment'){
      name = node.text;
  } else if(type === 'decl'){
      name = node.prop;
  }else{
    console.log(node);
  }
  return `${type}(${name})`
}

function walkAll(parent, depth){
  const prefix = '  '.repeat(depth);
  const isDeclaration = (node.type === 'decl');

  console.log(prefix + identify(parent));

  if(isDeclaration){
    if( (remove[decl.prop]) && (!whitelist[decl.value]) ){
      console.log(prefix +` removing ${decl.prop}: ${decl.value} | ${rulePath(rule)} ${declPath(decl)}`);
      decl.remove();
    }
  }

  if(!isDeclaration){
    if(parent.nodes){
      for(let child of parent.nodes){
        walkAll(child, depth + 1);
      }
    }
  }

}


export default function(){
  return postcss.plugin('postcss-uncolor', function(){return payload});
}

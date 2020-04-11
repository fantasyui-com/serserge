import postcss from 'postcss';
import fs from 'fs';

const alfamikefoxtrot = {
  'color': true,
  'background-color':true,
  'border-color':true,
  'border-top-color':true,
  'border-bottom-color':true,
  'border-left-color':true,
  'border-right-color':true,
}

function payload (root, result) {
  root.walkAtRules(function(rule) {
    rule.walkDecls(function(decl, i) {
      if(alfamikefoxtrot[decl.prop]){
        decl.remove();
      }
    });
  });
  root.walkRules(function(rule) {
    rule.walkDecls(function(decl, i) {
      if(alfamikefoxtrot[decl.prop]){
        decl.remove();
      }
    });
  });
}

export default function(){
  return postcss.plugin('reconnaissance', function(){return payload});
}

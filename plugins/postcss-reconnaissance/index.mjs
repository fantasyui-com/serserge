import postcss from 'postcss';
import fs from 'fs';

const nukeit = {
  'color': true,
  'background-color':true,
  'border-color':true,

  'border-top-color':true,
  'border-bottom-color':true,
  'border-left-color':true,
  'border-right-color':true,
}

function payload (root, result) {
  // console.log('root',root);
  // console.log('result',result);

  root.walkAtRules(function(rule) {

    rule.walkDecls(function(decl, i) {
      if(nukeit[decl.prop]){
        console.log(`REMOVING ${decl.prop}: ${decl.value}`);
        decl.remove();
      }

    });
  });

    root.walkRules(function(rule) {
    //console.log( rule );
    //if(rule.selector) console.log(`Rule Selector: ${rule.selector}`);
      rule.walkDecls(function(decl, i) {
        //console.log(decl);
        //console.log(`Declaration Selector: ${decl.selector}`);

        //if(decl.prop) console.log(`Declaration Property: ${decl.prop}`);
        //if(decl.value) console.log(`Declaration Value: ${decl.value}`);

        //if(decl.prop.includes('color')) console.log(`${decl.prop}: ${decl.value}`);



        if(nukeit[decl.prop]){
          //console.log(`REMOVING ${decl.prop}: ${decl.value}`);
          decl.remove();
        }

      });
    });
}



export default function(){
  return postcss.plugin('reconnaissance', function(){return payload});
}

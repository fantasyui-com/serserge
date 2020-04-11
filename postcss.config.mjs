import fs from 'fs';
import path from 'path';

import postcssScss from 'postcss-scss';
import atImport from 'postcss-import';

import postcssReconnaissance from './plugins/postcss-reconnaissance/index.mjs';

export default async function(){

return {
  syntax: postcssScss,
  parser: postcssScss,
  plugins: [
  // atImport({
  //
  //   xxresolve:function(id, basedir, importOptions){
  //     let target = '';
  //     if(id.includes('/')){
  //       let base = path.dirname(id);
  //       let file = path.basename(id);
  //       target = `${base}/_${file}.scss`;
  //     }else{
  //       target = `_${id}.scss`;
  //     }
  //     const response = `${basedir}/${target}`;
  //     return response
  //   }
  //
  // }),
    postcssReconnaissance(),
  ]
}

}

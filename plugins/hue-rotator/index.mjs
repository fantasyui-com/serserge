/*
  HUE TRANSFORMER
  Please use this as a template for color transforms.
*/

import Color from 'color';

module.exports = function({rotate, desaturate, text}){

  return function({color, decl, /* rule,decl,node */ }){

    let response = color;

    { // rotate hue
      let [h,w,b,a] = response.hwb().round().array();
      response = Color.hwb([h+rotate,w,b/2,a]);
    }

    { // flatten result
      let [h,s,v,a] = response.hsv().round().array();
      response = Color.hsv([h,s*desaturate,v,a]).round();
    }

    if((decl.prop === 'color') && (text > 0)){
      { // flatten result
        let [h,s,v,a] = response.hsv().round().array();
        response = Color.hsv([h,s,v*text,a]).round();
      }
    }
    return response;

  };

};

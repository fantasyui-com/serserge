import postcss from 'postcss';

export default async function({input, plugins, options}){

  const result = await postcss(plugins).process(input, options);

  return result;

}

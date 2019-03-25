import merge from 'deepmerge';

import defaults from './defaults';
import lightTheme from './light';
import darkTheme from './dark';

const light = createTheme(lightTheme);
const dark = createTheme(darkTheme);

function createTheme(theme) {
  let merged = merge(defaults, theme);

  // Do here something with all the themes if needed

  return merged;
}

export {
  light,
  dark
};
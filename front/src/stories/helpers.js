import React from 'react';

import { light } from '../themes';
import { ThemeContext } from '../context';

const ThemeProvider = (props) => (
  <ThemeContext.Provider value={{ theme: light}}>{props.children}</ThemeContext.Provider>
);
ThemeProvider.displayName = 'ThemeContext.Provider';

export {
  ThemeProvider
};
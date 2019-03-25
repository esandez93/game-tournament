import * as React from 'react';
import { ThemeContext } from '../context';

export default function withTheme(Component) {
  return (props) => (
    <ThemeContext.Consumer>
      {(theme) => <Component {...props} theme={theme.theme} />}
    </ThemeContext.Consumer>
  )
}
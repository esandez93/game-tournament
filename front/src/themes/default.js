/*
 * REFERENCE
 * https://next.material-ui.com/customization/themes/
 */

import { createMuiTheme } from '@material-ui/core/styles';

/*
 * The default theme is created using this code:
  createMuiTheme({
    palette: {
      primary: indigo,
      secondary: pink,
      error: red,
      // Used by `getContrastText()` to maximize the contrast between the background and
      // the text.
      contrastThreshold: 3,
      // Used to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    }
  })
 */

const light = createMuiTheme({
  palette: { type: 'light' }
});
const dark = createMuiTheme({
  palette: { type: 'dark' }
});

export {
  light,
  dark
};

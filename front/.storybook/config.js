import { configure, addDecorator } from '@storybook/react';

import { setConsoleOptions, withConsole  } from '@storybook/addon-console';
import { withKnobs } from '@storybook/addon-knobs';
import { withSmartKnobs } from 'storybook-addon-smart-knobs';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';

// Enable Hot Module Reload logs
/* setConsoleOptions({
  panelExclude: [],
}); */

addDecorator(withInfo);
addDecorator(withSmartKnobs);
addDecorator(withKnobs);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withA11y)

const req = require.context('../src/stories', true, /\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

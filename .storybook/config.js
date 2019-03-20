import { configure, addDecorator } from '@storybook/react';

import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withSmartKnobs } from 'storybook-addon-smart-knobs';
import { setConsoleOptions, withConsole } from '@storybook/addon-console';
import { withA11y } from '@storybook/addon-a11y';

// Enable logs for Hot Module Reload
/* setConsoleOptions({
  panelExclude: [],
}); */

addDecorator(withInfo);
addDecorator(withSmartKnobs);
addDecorator(withKnobs);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(withA11y)

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);

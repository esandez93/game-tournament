import React from 'react';

import { storiesOf } from '@storybook/react';

import {
  Icon
} from '../components';
import { ThemeProvider } from './helpers';

storiesOf('Icon', module)
  .addDecorator((story) => (
    <ThemeProvider>
      {story()}
    </ThemeProvider>
  ))

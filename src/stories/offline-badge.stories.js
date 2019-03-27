import React from 'react';

import { storiesOf } from '@storybook/react';

import {
  OfflineBadge
} from '../components';
import { ThemeProvider } from './helpers';

storiesOf('Offline Badge', module)
  .addDecorator((story) => (
    <ThemeProvider>
      {story()}
    </ThemeProvider>
  ))
  .add('Default', () => (
    <OfflineBadge />
  ))
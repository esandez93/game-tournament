import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import {
  Button
} from '@/components';
import { ThemeProvider } from './helpers';

storiesOf('Button', module)
  .addDecorator((story) => (
    <ThemeProvider>
      {story()}
    </ThemeProvider>
  ))
  .add('Default Button', () => (
    <Button
      onClick={action('Default button clicked')}
    >{text('text', 'Default button')}</Button>
  ))
  .add('Primary Button', () => (
    <Button
      color="primary"
      onClick={action('Primary button clicked')}
    >{text('text', 'Primary button')}</Button>
  ))
  .add('Secondary Button', () => (
    <Button
      color="secondary"
      onClick={action('Secondary button clicked')}
    >{text('text', 'Secondary button')}</Button>
  ))
  .add('Default Text Button', () => (
    <Button
      variant="text"
      onClick={action('Default text button clicked')}
    >{text('text', 'Default text button')}</Button>
  ))
  .add('Primary Text Button', () => (
    <Button
      variant="text"
      color="primary"
      onClick={action('Primary text button clicked')}
    >{text('text', 'Primary text button')}</Button>
  ))
  .add('Secondary Text Button', () => (
    <Button
      variant="text"
      color="secondary"
      onClick={action('Secondary text button clicked')}
    >{text('text', 'Secondary text button')}</Button>
  ))
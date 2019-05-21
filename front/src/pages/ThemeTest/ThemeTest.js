import React, { Component } from 'react';
import './ThemeTest.scss';

import clsx from 'clsx';

import { ThemeContext } from '@/context';
import { Button } from '@/components';

class ThemeTest extends Component {
  render() {
    const {
      themeName,
      changeTheme
    } = this.props;

    return (
      <div className={clsx('ThemeTest', this.props.className)}>
        <h1>ThemeTest Page</h1>
        <h3>Current theme: { themeName }</h3>

        <Button>Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button><br />

        <Button variant="text">Default Text</Button>
        <Button color="primary" variant="text">Primary Text</Button>
        <Button color="secondary" variant="text">Secondary Text</Button><br />

        <Button variant="outlined">Default Outlined</Button>
        <Button color="primary" variant="outlined">Primary Outlined</Button>
        <Button color="secondary" variant="outlined">Secondary Outlined</Button><br />

        <button onClick={() => changeTheme(themeName === 'defaultLight' ? 'defaultDark' : 'defaultLight')}>ToggleTheme</button>
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {(theme) => <ThemeTest {...props} theme={theme.theme} themeName={theme.name} changeTheme={theme.changeTheme} ref={ref} />}
  </ThemeContext.Consumer>
));

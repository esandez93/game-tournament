import React, { Component } from 'react';
import './ThemeTest.scss';

import { ThemeContext } from '../../context';
import { Button } from '../../components';

class ThemeTest extends Component {
  render() {
    const {
      themeName,
      changeTheme
    } = this.props;

    return (
      <div className="ThemeTest">
        <h1 style={{

        }}>ThemeTest Page</h1>

        <Button>Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button><br />

        <Button variant="text">Default Text</Button>
        <Button color="primary" variant="text">Primary Text</Button>
        <Button color="secondary" variant="text">Secondary Text</Button><br />

        <button onClick={() => changeTheme(themeName === 'light' ? 'dark' : 'light')}>ToggleTheme</button>
      </div>
    )
  }
}

export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {(theme) => <ThemeTest {...props} theme={theme.theme} themeName={theme.name} changeTheme={theme.changeTheme} ref={ref} />}
  </ThemeContext.Consumer>
));
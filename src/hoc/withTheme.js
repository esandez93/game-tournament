import React, { Component } from 'react';

import { ThemeContext } from '@/context';
import {
  getDisplayName,
  getPropTypes,
  getDefaultProps
} from '@/utils';

const ThemeConsumer = (props) => (
  <ThemeContext.Consumer>
    {props.children}
  </ThemeContext.Consumer>
)
ThemeConsumer.displayName = 'ThemeContext.Consumer';

const withTheme = (WrappedComponent) => 
  class extends Component {
    static displayName = `WithTheme(${getDisplayName(WrappedComponent)})`;
    static propTypes = getPropTypes(WrappedComponent);
    static defaultProps = getDefaultProps(WrappedComponent);

    render() {
      return (
        <ThemeConsumer>
          {(theme) => <WrappedComponent {...this.props} theme={theme.theme} />}
        </ThemeConsumer>
      );
    }
  }

export default withTheme;
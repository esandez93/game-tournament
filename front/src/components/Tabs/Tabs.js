import React from 'react';

import PropTypes from 'prop-types';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Tab,
  Tabs as MuiTabs
 } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

function Tabs (props) {
  const {
    className,
    color,
    tabs,
    onChange,
    current,
    ...other
  } = props;

  const classes = useStyles();

  return (
    <MuiTabs
      className={clsx('Tabs', classes.root, className)}
      value={current}
      onChange={onChange}
      variant="scrollable"
      scrollButtons="on"
      indicatorColor={color}
      textColor={color}
      {...other}
    >
      {tabs.map((tab, index) => {
        return <Tab key={index} label={tab.label} icon={tab.icon} />
      })}
    </MuiTabs>
  );
}

Tabs.propTypes = {
  color: PropTypes.string,
  tabs: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  current: PropTypes.number
};

Tabs.defaultProps = {
  color: 'primary',
  current: 0
};

export default Tabs;

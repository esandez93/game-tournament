import React, { useEffect } from 'react';
import styles from './BasePage.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import {
  AppContext,
  LocaleContext
} from '@/context';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';
import { cleanString } from '@/utils';

const useStyles = makeStyles(styles);

function BasePage (props) {
  const {
    component: Component,
    name,
    setTitle,
    translate,
    WorldSelector,
    GameSelector,
    ...other
  } = props;

  const size = useWindowSize();

  const classes = useStyles();
  const moreClasses = makeStyles((theme) => ({
    page: {
      paddingTop: size.width < breakpoints.m ? theme.spacing(10) : theme.spacing(2)
    }
  }))();

  useEffect(() => {
    setTitle(translate(`sections.${cleanString(name).toLowerCase()}`));
  } ,[]);

  return (
    <div className={classes.root}>
      <Component className={clsx('Page', moreClasses.page)} {...other} />
    </div>
  );
}

export default React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {(app) =>
      <LocaleContext.Consumer>
        {(locale) => <BasePage {...props} setTitle={app.setTitle} translate={locale.translate} ref={ref} />}
      </LocaleContext.Consumer>
    }
  </AppContext.Consumer>
));

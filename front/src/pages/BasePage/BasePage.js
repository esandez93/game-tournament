import React, { useEffect } from 'react';
import styles from './BasePage.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import {
  AppContext,
  LocaleContext,
  LoginContext
} from '@/context';
import { Loading } from '@/components';
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
    logged,
    WorldSelector,
    GameSelector,
    location,
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
    setTitle(translate(name));
  } ,[]);

  if (!logged && location.pathname !== '/login' && location.pathname !== '/signup') {
    return (
      <div className={clsx(classes.loading)}>
        <Loading isLoading={!logged} />
      </div>
    );
  } else {
    return <Component className={clsx('Page', moreClasses.page)} location={location} {...other} />;
  }
}

export default React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {(app) =>
      <LoginContext.Consumer>
        {(login) =>
          <LocaleContext.Consumer>
            {(locale) =>
              <BasePage {...props} setTitle={app.setTitle} translate={locale.translate} logged={login.logged} ref={ref} />
            }
          </LocaleContext.Consumer>
        }
      </LoginContext.Consumer>
    }
  </AppContext.Consumer>
));

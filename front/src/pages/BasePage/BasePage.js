import React, { Fragment } from 'react';
import styles from './BasePage.styles';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import {
  LoginContext,
  LocaleContext,
  AppContext
} from '@/context';
import { useWindowSize } from '@/hooks';
import { breakpoints } from '@/constants';

const useStyles = makeStyles(styles);

function BasePage (props) {
  const {
    component: Component,
    name,
    toggleSideMenu,
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

  return (
    <LoginContext.Consumer>
      {(login) =>
        <AppContext.Consumer>
          {({ toggleSideMenu }) =>
            <LocaleContext.Consumer>
              {(locale) => (
                <Fragment>
                  <div className={classes.root}>
                    <Component className={clsx('Page', moreClasses.page)} {...other} />
                  </div>
                </Fragment>
                )
              }
            </LocaleContext.Consumer>
          }
        </AppContext.Consumer>
      }
    </LoginContext.Consumer>
  );
}

export default BasePage;

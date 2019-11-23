import React, { useState, useRef, useEffect } from 'react';
import styles from './ContextMenu.styles';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles(styles);

function ContextMenu (props) {
  const {
    className,
    children,
    x,
    y,
    open,
    closeMenu,
    ...other
  } = props;

  let registeredEvents = false;
  const node = useRef();
  const classes = useStyles();
  const [ position, setPosition ] = useState({
    x: x - window.scrollX,
    y: y - window.scrollY
  });
  const [ initialXScroll, setInitialXScroll ] = useState(-1);
  const [ initialYScroll, setInitialYScroll ] = useState(-1);

  function handleClickOutside (event) {
    if (node.current.contains(event.target)) {
      // inside click
      return;
    }
    // outside click
    closeMenu();
  }

  function calcPosition (isScrollEvent) {
    if (open && node.current) {
      function getScroll(axis) {
        let scroll = null;

        if (axis === 'x')
          scroll = initialXScroll - window.scrollX;
        else
          scroll = initialYScroll - window.scrollY;

        return isScrollEvent ? scroll : 0;
      }

      /* function showDebug () {
        console.group('calcPosition');
          console.group('X');
            console.log('Screen Width =', window.innerWidth);
            console.log('Menu Width =', menuWidth);
            console.log('Click =', x);
            console.log('Scroll X =', window.scrollX);
            console.log('Initial Scroll X =', initialXScroll);
            console.log('Space X =', window.innerWidth - x + getScroll('x'));
            console.log('Fits X =', xSpace >= menuWidth);
            console.log('Position =', xPosition);
          console.groupEnd();
          console.group('Y');
            console.log('Screen Height =', window.innerHeight);
            console.log('Menu Height =', menuHeight);
            console.log('Click =', y);
            console.log('Scroll Y =', window.scrollY);
            console.log('Initial Scroll Y =', initialYScroll);
            console.log('Space Y =', window.innerHeight - y + getScroll('y'));
            console.log('Fits Y =', ySpace >= menuHeight);
            console.log('Position =', yPosition);
          console.groupEnd();
        console.groupEnd();
      } */

      const menuWidth = node.current.offsetWidth;
      const xSpace = window.innerWidth - x + getScroll('x');
      let xPosition = x + getScroll('x');

      const menuHeight = node.current.offsetHeight;
      const ySpace = window.innerHeight - y + getScroll('y');
      let yPosition = y + getScroll('y');

      // showDebug();

      if (xSpace < menuWidth) {
        // console.log(`${xSpace} < ${menuWidth}, Not enough X space`);
        xPosition = window.innerWidth + (isScrollEvent ? window.scrollX : 0) - menuWidth - 16;
      }

      setPosition({
        x: xPosition,
        y: yPosition
      });

      if (ySpace < menuHeight) {
        // console.log(`${ySpace} < ${menuHeight}, Not enough Y space`);
        yPosition = window.innerHeight + (isScrollEvent ? window.scrollY : 0) - menuHeight - 16;
      }

      setPosition({
        x: xPosition,
        y: yPosition
      });
    }
  }

  useEffect(() => {
    const handleScroll = () => calcPosition(true);
    if (open) {
      setInitialXScroll(window.scrollX);
      setInitialYScroll(window.scrollY);
    }

    if (open && !registeredEvents) {
      registeredEvents = true;
      document.addEventListener('scroll', handleScroll);
    } else {
      registeredEvents = false;
      document.removeEventListener('scroll', handleScroll);
    }

    return () => {
      registeredEvents = false;
      document.removeEventListener('scroll', handleScroll);
    };
  }, [ open, initialXScroll, initialYScroll ]);

  useEffect(calcPosition, [ x, y ]);

  return (
    <ClickAwayListener onClickAway={handleClickOutside}>
      <div className={clsx(className, classes.root)} style={{
        left: position.x,
        top: position.y
      }} ref={node} hidden={!open} {...other}>
        {children}
      </div>
    </ClickAwayListener>
  )
}

ContextMenu.propTypes = {
  open: PropTypes.bool,
  closeMenu: PropTypes.func.isRequired,
  x: PropTypes.number,
  y: PropTypes.number
};
ContextMenu.defaultProps = {
  open: false
};

export default ContextMenu;

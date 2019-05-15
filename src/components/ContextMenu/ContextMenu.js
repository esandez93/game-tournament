import React, { useState, useRef, useEffect } from 'react';
import './ContextMenu.scss';
import styles from './styles.js';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

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
      const menuWidth = node.current.offsetWidth;
      const xSpace = window.innerWidth - x - (isScrollEvent ? window.scrollX : 0);
      let xPosition = x - (isScrollEvent ? window.scrollX : 0);

      const menuHeight = node.current.offsetHeight;
      const ySpace = window.innerHeight - y - (isScrollEvent ? window.scrollY : 0);
      let yPosition = y - (isScrollEvent ? window.scrollY : 0);

      console.group('calcPosition');
        console.group('X');
          console.log('Screen Width =', window.innerWidth);
          console.log('Menu Width =', menuWidth);
          console.log('Click =', x);
          console.log('Scroll X =', window.scrollX);
          console.log('Space X =', window.innerWidth - x - window.scrollX);
          console.log('Fits X =', xSpace >= menuWidth);
          console.log('Position =', xPosition);
        console.groupEnd();
        console.group('Y');
          console.log('Screen Height =', window.innerHeight);
          console.log('Menu Height =', menuHeight);
          console.log('Click =', y);
          console.log('Scroll Y =', window.scrollY);
          console.log('Space Y =', window.innerHeight - y - window.scrollY);
          console.log('Fits Y =', ySpace >= menuHeight);
          console.log('Position =', yPosition);
        console.groupEnd();
      console.groupEnd();

      if (xSpace < menuWidth) {
        console.log(`${xSpace} < ${menuWidth}, Not enough X space`);
        xPosition = window.innerWidth + (isScrollEvent ? window.scrollX : 0) - menuWidth - 30;
      }

      setPosition({
        x: xPosition,
        y: yPosition
      });

      if (ySpace < menuHeight) {
        console.log(`${ySpace} < ${menuHeight}, Not enough Y space`);
        yPosition = window.innerHeight + (isScrollEvent ? window.scrollY : 0) - menuHeight - 30;
      }

      setPosition({
        x: xPosition,
        y: yPosition
      });
    }
  }

  useEffect(calcPosition, [ x, y ]);

  useEffect(() => {
    const handleScroll = () => calcPosition(true);

    if (open && !registeredEvents) {
      registeredEvents = true;
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    } else {
      registeredEvents = false;
      document.removeEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    }

    return () => {
      registeredEvents = false;
      document.removeEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    };
  }, [ open ]);

  return (
    <div className={clsx(className, classes.root)} style={{
      left: position.x,
      top: position.y
    }} ref={node} hidden={!open} {...other}>
      {children}
    </div>
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

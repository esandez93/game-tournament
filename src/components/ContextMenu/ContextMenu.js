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

  function handleScroll (event) {
    if (!open) return

    setPosition({
      x: x - window.scrollX,
      y: y - window.scrollY
    });
  }

  useEffect(() => {
    const menuWidth = node.current.offsetWidth;
    const space = window.innerWidth - x - window.scrollX
    let xPosition = x - window.scrollX;

    /* console.log('Total X =', window.innerWidth);
    console.log('X =', x - window.scrollX);
    console.log('Space =', space);
    console.log('Menu Width =', menuWidth);
    console.log('Fits?', space > menuWidth); */

    if (space < menuWidth)
      xPosition -= menuWidth;

    // console.log('Final X =', xPosition);

    setPosition({
      x: xPosition,
      y: y - window.scrollY
    });
  }, [ x, y ]);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll);
    }

    return () => {
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

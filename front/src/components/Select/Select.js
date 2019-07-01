import React, { useState, useEffect, useRef } from 'react';
import styles from './Select.styles';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Input,
  FilledInput,
  OutlinedInput,
  Typography,
  Divider
} from '@material-ui/core';
import MuiSelect from '@material-ui/core/Select';

import { Avatar } from '@/components';

const useStyles = makeStyles(styles);

// TODO: Create validations
function Select (props) {
  const {
    className,
    id,
    value,
    onChange,
    items,
    variant,
    label,
    placeholder,
    children,
    margin,
    renderValue,
    required,
    inputProps,
    multiple,
    dividers
  } = props;

  let selectMargin = 1;
  if (margin === 'dense') selectMargin = 0;
  else if (margin === 'normal') selectMargin = 2;

  const classes = useStyles();
  const moreClasses = makeStyles((theme) => ({
    root: {
      marginTop: `${theme.spacing(selectMargin)}px`,
      marginBottom: `${theme.spacing(selectMargin)}px`
    }
  }))();

  const inputLabel = useRef(null);
  const [ labelWidth, setLabelWidth ] = useState(0);
  const [ menuItems, setMenuItems ] = useState([]);

  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  useEffect(() => {
    let _menuItems = [];

    if (items) {
      items.forEach((item, index) => {
        _menuItems.push(
          <MenuItem className={clsx(classes.item)} key={index+item.text} value={item.value}>
            {item.avatar &&
              <Avatar
                className={clsx(classes.itemAvatar)}
                src={item.avatar === true ? null : item.avatar}
                name={item.avatarName}
                size={item.avatarSize || 'small'}
                alt={`${item.avatarName || item.text} avatar`}
              />
            }
            {item.image && <img className={clsx(classes.itemImage)} src={item.image} alt="logo" />}
            <Typography>{item.text}</Typography>
          </MenuItem>
        );
        if (dividers && index < items.length-1) {
          _menuItems.push(
            <Divider key={index} />
          );
        }
      });
    } else if (children) {
      _menuItems = children;
    }

    setMenuItems(_menuItems);
  }, [ items ]);

  function getInput () {
    let Comp = null
    switch(variant) {
      case 'outlined': Comp = OutlinedInput; break;
      case 'filled': Comp = FilledInput; break;
      default: Comp = Input; break;
    }

    return <Comp
      inputProps={{ ...inputProps, className: clsx(classes.innerInput, inputProps.className) }}
      labelWidth={labelWidth} name={label} id={id || label.replace(' ', '')} />
  }

  return (
    <FormControl className={clsx(className, classes.root, moreClasses.root)} variant={variant}>
      <InputLabel ref={inputLabel} id={id || label.replace(' ', '')}>
        {label}
      </InputLabel>
      <MuiSelect
        onChange={onChange}
        input={getInput()}
        value={value || ''}
        multiple={multiple}
        renderValue={renderValue}
      >
        {!required && placeholder &&
          <MenuItem value="">
            {placeholder}
          </MenuItem>
        }
        {menuItems}
      </MuiSelect>
    </FormControl>
  );
}

Select.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object
  ]),
  variant: PropTypes.oneOf([ 'standard', 'outlined', 'filled' ]),
  margin: PropTypes.oneOf([ 'none', 'dense', 'normal' ]),
  onChange: PropTypes.func.isRequired,
  items: PropTypes.array,
  inputProps: PropTypes.object,
  multiple: PropTypes.bool
};
Select.defaultProps = {
  variant: 'outlined',
  type: 'text',
  margin: 'normal',
  inputProps: {},
  multiple: false
};

export default Select;

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
  OutlinedInput
} from '@material-ui/core';
import MuiSelect from '@material-ui/core/Select';

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
    required
  } = props;

  let selectMargin = 1;
  if (margin === 'dense') selectMargin = 0;
  else if (margin === 'normal') selectMargin = 2;

  const classes = useStyles();
  const moreClasses = makeStyles((theme) => ({
    formControl: {
      marginTop: `${theme.spacing(selectMargin)}px`,
      marginBottom: `${theme.spacing(selectMargin)}px`
    }
  }))();

  const inputLabel = useRef(null);
  const [ labelWidth, setLabelWidth ] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  function getInput () {
    let Comp = null
    switch(variant) {
      case 'outlined': Comp = OutlinedInput; break;
      case 'filled': Comp = FilledInput; break;
      default: Comp = Input; break;
    }

    return <Comp labelWidth={labelWidth} name={label} id={id || label.replace(' ', '')} />
  }

  return (
    <FormControl className={clsx(className, classes.formControl, moreClasses.formControl)} variant={variant}>
      <InputLabel ref={inputLabel} id={id || label.replace(' ', '')}>
        {label}
      </InputLabel>
      <MuiSelect
        value={value}
        onChange={onChange}
        input={getInput()}
      >
        {!required && placeholder &&
          <MenuItem value="">
            {placeholder}
          </MenuItem>
        }
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value}>{item.text}</MenuItem>
        ))}
        {!items && children}
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
  onChange: PropTypes.func.isRequired
};
Select.defaultProps = {
  variant: 'outlined',
  type: 'text',
  margin: 'normal'
};

export default Select;

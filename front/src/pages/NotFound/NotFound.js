import React from 'react';
import './NotFound.scss';

import clsx from 'clsx';

function NotFound (props) {
  const {
    className
  } = props;

  return (
    <div className={clsx('NotFound', className)}>
      {
        //NotFound Page
      }
    </div>
  );
}

export default NotFound;

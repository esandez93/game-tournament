import React, { Fragment, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { checkToken } from '@/api/auth';

const withAuth = (ComponentToProtect, setLogin) => (props) => {
  const [ loading, setLoading ] = useState(true);
  const [ redirect, setRedirect ] = useState(false);

  useEffect(() => {
    checkToken()
      .then(res => {
        if (setLogin) setLogin(true);

        setLoading(false);
      })
      .catch(err => {
        if (setLogin) setLogin(false);

        // localStorage.removeItem('user');
        setLoading(false);
        setRedirect(true);
      });
  }, []);

  if (loading) {
    return null;
  } else if (redirect) {
    return <Redirect to="/login" />;
  } else {
    return (
      <Fragment>
        <ComponentToProtect {...props} />
      </Fragment>
    );
  }
};

export default withAuth;

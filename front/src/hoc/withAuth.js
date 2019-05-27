import React, { Fragment, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { checkToken } from '@/api/users';

const withAuth = (ComponentToProtect) => (props) => {
  const [ loading, setLoading ] = useState(true);
  const [ redirect, setRedirect ] = useState(false);

  useEffect(() => {
    checkToken()
      .then(res => {
        if (res.status === 200) {
          setLoading(false);
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
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

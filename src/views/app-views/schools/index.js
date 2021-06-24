import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import {useSelector} from 'react-redux';
import Loading from 'components/shared-components/Loading';
import Branch from './branch';
import School from './school';
import ViewSchool from './school/viewSchool';
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import { SUPERADMIN, ADMIN } from 'constants/AppConstant';

function RouteInterceptor({ children, role, url }) {
  return (
    <Route
      render={({ location }) =>
        role===SUPERADMIN ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: `${url}/branch`,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const Schools = ({ match }) => {
  const role = useSelector((state) => state.userLogin.user.role_id);

  return (
    <div>
      {
        role===SUPERADMIN || role===ADMIN ?
        <Switch>
          <Route path={`${match.url}/branch`} component={Branch} />
          <RouteInterceptor path={APP_PREFIX_PATH} role={role} url={match.url}>
            <Route path={`${match.url}/school`} component={School} />
            <Route path={`${match.url}/view/:id`} component={ViewSchool} />
          </RouteInterceptor>
          <Redirect from={`${match.url}`} to={`${match.url}/branch`} />
        </Switch>
        :
        <Redirect from={`${match.url}`} to={`${APP_PREFIX_PATH}/dashboards`} />
      }
    </div>
  )
};

export default Schools;

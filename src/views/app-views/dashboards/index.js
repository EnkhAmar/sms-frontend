import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';

const Dashboards = ({ match }) => {
  return(
  <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      <Route path={`${match.url}/general`} component={lazy(() => import(`./general`))} />
      <Route path={`${match.url}/operator`} component={lazy(() => import(`./operator`))} />
      <Route path={`${match.url}/class_students`} component={lazy(() => import(`./class_students`))} />
      <Redirect from={`${match.url}`} to={`${match.url}/general`} />
    </Switch>
  </Suspense>
)};

export default Dashboards;

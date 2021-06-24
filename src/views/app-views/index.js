import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>
        <Route path={`${APP_PREFIX_PATH}/home`} component={lazy(() => import(`./home`))} />
        <Route path={`${APP_PREFIX_PATH}/class`} component={lazy(() => import(`./class`))} />
        <Route path={`${APP_PREFIX_PATH}/schools`} component={lazy(() => import(`./schools`))} />
        <Route path={`${APP_PREFIX_PATH}/dashboards`} component={lazy(() => import(`./dashboards`))} />
        <Route path={`${APP_PREFIX_PATH}/staffs`} component={lazy(() => import(`./staffs`))} />
        <Route path={`${APP_PREFIX_PATH}/lessons`} component={lazy(() => import(`./lessons`))} />
        <Route path={`${APP_PREFIX_PATH}/rooms`} component={lazy(() => import(`./rooms`))} />
        <Route path={`${APP_PREFIX_PATH}/datasheet`} component={lazy(() => import(`./datasheet`))} />
        <Route path={`${APP_PREFIX_PATH}/schedule`} component={lazy(() => import(`./schedule`))} />
        <Route path={`${APP_PREFIX_PATH}/utilities`} component={lazy(() => import(`./utilities`))} />
        <Route path={`${APP_PREFIX_PATH}/profile/:id`} component={lazy(() => import(`./profile`))} />
        <Route path={`${APP_PREFIX_PATH}/students`} component={lazy(() => import(`./students`))} />
        <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/dashboards`} />
      </Switch>
    </Suspense>
  )
}

export default React.memo(AppViews);

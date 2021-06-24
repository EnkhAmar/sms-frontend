import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import {useSelector} from 'react-redux';
import Loading from 'components/shared-components/Loading';
// import Branch from './branch';
// import School from './school';
// import ViewSchool from './school/viewSchool';
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import { SUPERADMIN, ADMIN } from 'constants/AppConstant';
import Status from "./Status";
import Discount from "./Discount";
import DatasheetStatus from "./DatasheetStatus";
import PaymentMethod from "./PaymentMethod";

const Utilities = ({ match }) => {
  return (
    <div>
        <Switch>
            <Route path={`${match.url}/status`} component={ Status } />
            <Route path={`${match.url}/datasheet-status`} component={ DatasheetStatus } />
            <Route path={`${match.url}/discount`} component={ Discount } />
            <Route path={`${match.url}/payment-method`} component={ PaymentMethod } />
        </Switch>
    </div>
  )
};

export default Utilities;

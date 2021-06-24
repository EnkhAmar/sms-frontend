import React, { Component } from 'react'
import { Route, Switch, } from 'react-router-dom';
import ViewClass from './viewClass';
import Classes from './classes';

export class ClassContent extends Component {
	render() {
		const { match } = this.props
		return (
			<Switch>
				<Route path={`${match.url}/view/:id`} component={ViewClass} />
				<Route path={`${match.url}`} component={Classes} />
			</Switch>
		)
	}
}

export default ClassContent;

import React, { Component, useEffect } from 'react';
import { Switch, BrowserRouter as Router,Route } from "react-router-dom";
import { Provider, Subscribe } from "unstated";

import allStores from './containers';
import { userRoutes , authRoutes } from "./routes/allRoutes";
import Authmiddleware from "./routes/middleware/Authmiddleware";
import NonAuthmiddleware from "./routes/middleware/NonAuthMiddleware";
import NonAuthLayout from "./components/NonAuthLayout";
import Layout from "./components/Layout";

import "./assets/scss/theme.scss";
// import TestingSpeech from './components/TestingSpeech';

class App extends Component{

	constructor(props) {
		super(props);
		this.layoutStore = allStores[0];
		this.footballStore = allStores[1];
		this.userStore = allStores[2];
	}

	appScreen = (layout) => 
		<React.Fragment>
			<Router>
				<Switch>
					{authRoutes.map((route, idx) => (
						<NonAuthmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={NonAuthLayout}
						/>
					))}

					{userRoutes.map((route, idx) => (
						<Authmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={Layout}
						/>
					))}

				</Switch>
			</Router>
		</React.Fragment>

	render() {
		return (
			<Provider inject={allStores}>
				<Subscribe to={[this.layoutStore]}>
					{layoutStore => (
						this.appScreen(layoutStore)
					)}
				</Subscribe>
			</Provider>
		)
	}
}

export default App;

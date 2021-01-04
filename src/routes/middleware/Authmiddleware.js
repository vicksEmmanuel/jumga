import React, { useEffect } from "react";
import { Route,Redirect,withRouter } from "react-router-dom";

const Authmiddleware = ({
	component: Component,
	layout: Layout,
	path
}) => {
	return (
		<Route
			path={path}
			render={props => {
			
			// here you can apply condition
			if (!localStorage.getItem("stadium--xx-xx-xx-10/20/20--authUser")) {
					return (
						<Redirect to={{ pathname: "/login", state: { from: props.location } }} />
					);
				}

				return <Layout>
					<Component {...props} />
				</Layout>;
			}}
		/>
	);
}

export default withRouter(Authmiddleware);


import React, { useEffect } from "react";
import { Route,Redirect,withRouter } from "react-router-dom";

const NonAuthmiddleware = ({
	component: Component,
	layout: Layout,
	path
}) => {
	return (
		<Route
			path={path}
			render={props => {
			let user = localStorage.getItem("stadium--xx-xx-xx-10/20/20--authUser");
			// here you can apply condition
			if (user) {
                    if (new Date(JSON.parse(user)?.expirationDate) > Date.now())
                        return (
                            <Redirect to={{ pathname: "/home", state: { from: props.location } }} />
                        );
				}

				return <Layout>
					<Component {...props} />
				</Layout>;
			}}
		/>
	);
}

export default withRouter(NonAuthmiddleware);


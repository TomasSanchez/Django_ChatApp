import { useContext } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import { ContextAuth } from "../context/AuthContext";

const PrivateRoute = (props: any) => {
	const location = useLocation();
	const { isLogedIn } = useContext(ContextAuth);
	console.log("isLogedIn", isLogedIn);

	return isLogedIn === undefined ? (
		<div>Loading</div>
	) : isLogedIn ? (
		<Route {...props} />
	) : (
		<Redirect
			to={{
				pathname: "/login",
				state: { from: location },
			}}
		/>
	);
};

export default PrivateRoute;

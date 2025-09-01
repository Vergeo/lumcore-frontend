import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
	const { auth } = useAuth();

	return auth?.username ? (
		auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
			<Outlet />
		) : (
			<Navigate to="/" />
		)
	) : (
		<Navigate to="/" />
	);
	return auth?.username ? <Outlet /> : <Navigate to="/" />;
};

export default RequireAuth;

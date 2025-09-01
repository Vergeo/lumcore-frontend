import axios, { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		const reqIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers[
						"Authorization"
					] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			(err) => Promise.reject(err)
		);
		const resIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (err) => {
				const prevRequest = err?.config;
				if (err?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;
					const newAccessToken = await refresh();
					prevRequest.headers[
						"Authorization"
					] = `Bearer ${newAccessToken}`;
					return axiosPrivate(prevRequest);
				}
				return Promise.reject(err);
			}
		);

		return () => {
			axiosPrivate.interceptors.request.eject(reqIntercept);
			axiosPrivate.interceptors.response.eject(resIntercept);
		};
	}, [auth, refresh]);

	return axiosPrivate;
};

export default useAxiosPrivate;

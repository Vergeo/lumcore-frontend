import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		try {
			const res = await axios.get("/auth/refresh", {
				withCredentials: true,
			});

			setAuth({
				userId: res.data.userId,
				username: res.data.username,
				roles: res.data.roles,
				accessToken: res.data.accessToken,
			});

			return res.data.accessToken;
		} catch (err) {
			setAuth(null);
			throw err;
		}
	};
	return refresh;
};

export default useRefreshToken;

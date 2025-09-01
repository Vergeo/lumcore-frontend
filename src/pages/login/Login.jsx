import React, { use, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

const Login = () => {
	const { setAuth } = useAuth();
	const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const loginButtonClicked = async (e) => {
		e.preventDefault();

		try {
			const userObj = { username, password };
			const res = await axios.post("/auth", userObj, {
				withCredentials: true,
			});

			const accessToken = res?.data?.accessToken;
			const roles = res?.data?.roles;
			// setAuth(res.data);
			setAuth({ username, roles, accessToken });
			navigate("/orders");
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="w-screen h-screen bg-[var(--mint)] flex items-center justify-center">
			<div className="w-90 h-120 bg-[var(--light-mint)] flex flex-col items-center justify-center rounded-md shadow-md">
				<h1 className="text-[var(--dark-mint)] text-2xl font-bold">
					Login
				</h1>
				<form
					onSubmit={loginButtonClicked}
					className="flex flex-col w-4/5 gap-5"
				>
					<div className="flex flex-col">
						<label htmlFor="username" className="">
							Username
						</label>
						<input
							type="text"
							id="username"
							autoComplete="off"
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							value={username}
							required
							className="px-2 pt-1 bg-gray-200 outline-none border-b-4 border-gray-200 focus:border-[var(--dark-mint)] transition-all ease-in  rounded-sm"
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							autoComplete="off"
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							value={password}
							required
							className="px-2 pt-1 bg-gray-200 outline-none border-b-4 border-gray-200 focus:border-[var(--dark-mint)] transition-all ease-in  rounded-sm"
						/>
					</div>
					<div className="flex flex-col items-center">
						<input
							type="submit"
							value="Log In"
							className="w-fit bg-(--mint) text-(--white) px-3 py-1 cursor-pointer hover:bg-(--dark-mint) rounded-sm transition-all ease-in"
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;

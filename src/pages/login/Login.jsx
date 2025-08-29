import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../contexts/currentUserProvider";

const Login = () => {
	const navigate = useNavigate();
	const { currentUser, setCurrentUser } = getCurrentUser();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [users, setUsers] = useState([]);

	const loginButtonClicked = async (e) => {
		e.preventDefault();
		const userObj = { username, password };
		const res = await axios.post(
			"http://localhost:3500/users/auth/",
			userObj
		);
		if (res.data) {
			setCurrentUser(username);
		}
	};

	const getUsers = async () => {
		const res = await axios.get("http://localhost:3500/users/");
		setUsers(res.data);
	};

	const checkUsername = async () => {
		const users = await axios.get("http://localhost:3500/users/");
		users.data.forEach((user) => {
			if (user.username == currentUser) {
				return true;
			}
		});
		return false;
	};

	useEffect(() => {
		if (currentUser && users.length) {
			if (checkUsername()) {
				navigate("/orders");
			}
		}
	}, [currentUser, users]);

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<div className="w-screen h-screen bg-[var(--mint)] flex items-center justify-center">
			<div className="w-90 h-120 bg-[var(--white)] flex flex-col items-center justify-center">
				<h1 className="text-[var(--dark-mint)] text-xl font-bold">
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
							className="px-1 pt-1 bg-gray-200 outline-none border-b-4 border-gray-200 focus:border-[var(--dark-mint)] transition-all ease-in"
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
							className="px-1 pt-1 bg-gray-200 outline-none border-b-4 border-gray-200 focus:border-[var(--dark-mint)] transition-all ease-in"
						/>
					</div>
					<div className="flex flex-col items-center">
						<input
							type="submit"
							value="Log In"
							className="w-fit bg-(--mint) text-(--white) px-3 py-1 cursor-pointer hover:bg-(--dark-mint)"
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;

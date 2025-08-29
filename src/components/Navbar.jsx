import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../contexts/currentUserProvider";
import axios from "axios";

const Navbar = () => {
	const navigate = useNavigate();
	const { currentUser, setCurrentUser } = getCurrentUser("");
	const [users, setUsers] = useState([]);

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
		if (currentUser == "") {
			navigate("/");
		}
		if (currentUser && users.length) {
			if (!checkUsername()) {
				navigate("/");
			}
		}
	}, [currentUser, users]);

	useEffect(() => {
		getUsers();
	}, []);

	return (
		<div className="w-52 h-screen bg-[var(--dark-mint)] px-2 py-5 flex flex-col gap-2 sticky top-0">
			<div>
				<div className="text-[var(--light-mint)] p-1 ">
					Welcome, {currentUser}
				</div>
				<div
					className="text-[var(--white)] p-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in"
					onClick={() => {
						navigate("/orders/new");
					}}
				>
					Pesanan Baru
				</div>
				<div
					className="text-[var(--white)] p-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in"
					onClick={() => {
						navigate("/orders");
					}}
				>
					Daftar Pesanan
				</div>
				<div
					className="text-[var(--white)] p-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in"
					onClick={() => {
						navigate("/orders/recap");
					}}
				>
					Rekap Pesanan
				</div>
				<div
					className="text-[var(--white)] p-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in"
					onClick={() => {
						navigate("/items");
					}}
				>
					Menu Items
				</div>
			</div>
			<div className="p-1">
				<p
					className="text-red-200 cursor-pointer hover:text-red-400 transition-all ease-in"
					onClick={() => {
						setCurrentUser("");
					}}
				>
					Logout
				</p>
			</div>
		</div>
	);
};

export default Navbar;

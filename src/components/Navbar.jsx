import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../contexts/currentUserProvider";
import axios from "axios";
import { apiRoot } from "../config/apiRoot";

const Navbar = () => {
	const navigate = useNavigate();
	const { currentUser, setCurrentUser } = getCurrentUser("");
	const [users, setUsers] = useState([]);
	const [manager, setManager] = useState(false);

	const getUsers = async () => {
		const res = await axios.get(`${apiRoot}users/`);
		setUsers(res.data);
	};

	const checkUsername = async () => {
		users.forEach((user) => {
			if (user.username == currentUser) {
				user.roles.forEach((role) => {
					if (role === "Manager") {
						setManager(true);
					}
				});
				return true;
			}
		});
		return false;
	};

	useEffect(() => {
		if (currentUser == "") {
			navigate("/");
		}
		if (currentUser && users?.length) {
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
				<div className="text-[var(--light-mint)] p-1 text-lg font-bold">
					Welcome, {currentUser}
				</div>
				<div
					className="text-[var(--white)] px-2 py-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in rounded-sm"
					onClick={() => {
						navigate("/orders/new");
					}}
				>
					Pesanan Baru
				</div>
				<div
					className="text-[var(--white)] px-2 py-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in rounded-sm"
					onClick={() => {
						navigate("/orders");
					}}
				>
					Daftar Pesanan
				</div>
				<div
					className="text-[var(--white)] px-2 py-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in rounded-sm"
					onClick={() => {
						navigate("/orders/recap");
					}}
				>
					Rekap Pesanan
				</div>
				{manager && (
					<div
						className="text-[var(--white)] px-2 py-1 cursor-pointer hover:bg-[var(--mint)] transition-all ease-in rounded-sm"
						onClick={() => {
							navigate("/items");
						}}
					>
						Menu Items
					</div>
				)}
			</div>
			<div className="mt-2">
				<p
					className="text-red-200 px-2 py-1 cursor-pointer hover:text-red-400 hover:bg-[var(--mint)] transition-all ease-in rounded-sm"
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

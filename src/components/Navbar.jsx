import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
	const navigate = useNavigate();
	const { auth } = useAuth();
	const [manager, setManager] = useState(false);

	useEffect(() => {
		setManager(auth?.roles?.includes("Manager"));
	}, []);

	return (
		<div className="w-52 h-screen bg-[var(--dark-mint)] px-2 py-5 flex flex-col gap-2 sticky top-0">
			<div>
				<div className="text-[var(--light-mint)] p-1 text-lg font-bold">
					Welcome, {auth.username}
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
						navigate("/");
					}}
				>
					Logout
				</p>
			</div>
		</div>
	);
};

export default Navbar;

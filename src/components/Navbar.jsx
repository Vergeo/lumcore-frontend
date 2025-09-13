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
		<div className="w-52 h-screen bg-(--accent) px-2 py-5 flex flex-col gap-5 sticky top-0">
			<div className="text-(--accent-dark) p-2 text-lg font-bold bg-(--accent-light) rounded-sm shadow-md">
				Welcome, {auth.username}
			</div>
			<div>
				<div
					className="text-(--bg-light) px-2 py-1 cursor-pointer hover:bg-(--accent-light) hover:text-(--text-muted) transition-all ease-in rounded-sm"
					onClick={() => {
						navigate("/orders/new");
					}}
				>
					<div className="flex gap-2 items-center">
						<div className="h-full aspect-square">
							<i className="fa-solid fa-plus"></i>
						</div>
						Pesanan Baru
					</div>
				</div>
				<div
					className="text-(--bg-light) px-2 py-1 cursor-pointer hover:bg-(--accent-light) hover:text-(--text-muted) transition-all ease-in rounded-sm"
					onClick={() => {
						navigate("/orders");
					}}
				>
					<div className="flex gap-2 items-center">
						<div className="h-full aspect-square">
							<i className="fa-solid fa-list-ul"></i>
						</div>
						Daftar Pesanan
					</div>
				</div>
				<div
					className="text-(--bg-light) px-2 py-1 cursor-pointer hover:bg-(--accent-light) hover:text-(--text-muted) transition-all ease-in rounded-sm"
					onClick={() => {
						navigate("/orders/recap");
					}}
				>
					<div className="flex gap-2 items-center">
						<div className="h-full aspect-square">
							<i className="fa-solid fa-book"></i>
						</div>
						Rekap Penjualan
					</div>
				</div>
				{manager && (
					<div>
						<hr className="h-0.5 bg-(--accent-light) border-0 m-2"></hr>
						<div
							className="text-(--bg-light) px-2 py-1 cursor-pointer hover:bg-(--accent-light) hover:text-(--text-muted) transition-all ease-in rounded-sm"
							onClick={() => {
								navigate("/items");
							}}
						>
							<div className="flex gap-2 items-center">
								<div className="h-full aspect-square">
									<i className="fa-solid fa-burger"></i>
								</div>
								Daftar Menu
							</div>
						</div>
					</div>
				)}
			</div>
			<div></div>
			<div className="">
				<p
					className="text-(--bg-light) bg-(--alert-red) px-2 py-1 cursor-pointer hover:bg-(--alert-red-dark) transition-all ease-in rounded-sm"
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { style } from "../styles/style";

const Navbar = () => {
	const navigate = useNavigate();
	const { auth } = useAuth();
	const [manager, setManager] = useState(false);
	const [admin, setAdmin] = useState(false);

	useEffect(() => {
		setManager(auth?.roles?.includes("Manager"));
		setAdmin(auth?.roles?.includes("Admin"));
	}, []);

	return (
		<div className="w-60 h-screen bg-(--accent) px-2 py-5 flex flex-col gap-5 sticky top-0">
			<div className="text-(--accent-dark) p-2 text-lg font-bold bg-(--accent-light) rounded-sm shadow-md">
				Welcome, {auth.username}
			</div>
			{/* <div>
				<div
					className={style.navbar_button}
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
						Rekap Penjualan Lama
					</div>
				</div>
				{manager && (
					<hr className="h-0.5 rounded-4xl bg-(--accent-light) border-0 my-2"></hr>
				)}
				{manager && (
					<div>
						<button
							className={style.navbar_button}
							onClick={() => {
								navigate("/items");
							}}
						>
							<i className="fa-solid fa-burger mr-2"></i>
							Daftar Menu
						</button>
					</div>
				)}
			</div>
			<hr className="h-1 rounded-4xl bg-(--accent-light) border-0"></hr> */}
			<div>
				<button
					className={style.navbar_button}
					onClick={() => {
						navigate("/order/create");
					}}
				>
					<i className="fa-solid fa-plus mr-2"></i>
					Pesanan Baru
				</button>
				<button
					className={style.navbar_button}
					onClick={() => {
						navigate("/order");
					}}
				>
					<i className="fa-solid fa-list-ul mr-2"></i>
					Daftar Pesanan
				</button>
				<button
					className={style.navbar_button}
					onClick={() => {
						navigate("/order/recap");
					}}
				>
					<i className="fa-solid fa-book mr-2"></i>
					Rekap Penjualan
				</button>

				<button
					className={style.navbar_button}
					onClick={() => {
						navigate("/stock/recap");
					}}
				>
					<i className="fa-solid fa-boxes-stacked mr-2"></i>
					Rekap Stok
				</button>
				<hr className="h-0.5 rounded-4xl bg-(--accent-light) border-0 my-2"></hr>

				<button
					className={style.navbar_button}
					onClick={() => {
						navigate("/orders/recap");
					}}
				>
					<i className="fa-solid fa-book mr-2"></i>
					Penjualan Lama
				</button>
				{manager && (
					<hr className="h-0.5 rounded-4xl bg-(--accent-light) border-0 my-2"></hr>
				)}
				{manager && (
					<div>
						<button
							className={style.navbar_button}
							onClick={() => {
								navigate("/menu");
							}}
						>
							<i className="fa-solid fa-burger mr-2"></i>
							Daftar Menu
						</button>
						<button
							className={style.navbar_button}
							onClick={() => {
								navigate("/stock");
							}}
						>
							<i className="fa-solid fa-boxes-stacked mr-2"></i>
							Daftar Stok
						</button>
						<button
							className={style.navbar_button}
							onClick={() => {
								navigate("/stock/movement");
							}}
						>
							<i className="fa-solid fa-boxes-stacked mr-2"></i>
							Perubahan Stok
						</button>
						<button
							className={style.navbar_button}
							onClick={() => {
								navigate("/employee");
							}}
						>
							<i className="fa-solid fa-user mr-2"></i>
							Daftar Karyawan
						</button>
					</div>
				)}
			</div>
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

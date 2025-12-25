import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const MenuList = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [menuCategories, setMenuCategories] = useState([]);
	const [menus, setMenus] = useState([]);
	const [isFetchingMenuCategories, setIsFetchingMenuCategories] =
		useState(true);
	const [isFetchingMenus, setIsFetchingMenus] = useState(true);

	const fetchMenuCategories = async () => {
		try {
			setIsFetchingMenuCategories(true);
			const res = await axiosPrivate.get(
				"menuCategory/getAllMenuCategories"
			);
			setMenuCategories(res.data);
			setIsFetchingMenuCategories(false);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	const fetchMenus = async () => {
		try {
			setIsFetchingMenus(true);
			const res = await axiosPrivate.get("menu/getAllMenus");
			setMenus(res.data);
			setIsFetchingMenus(false);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		fetchMenuCategories();
		fetchMenus();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Daftar Kategori Menu</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					<button
						className={style.button}
						onClick={() => {
							navigate("/menuCategory/create");
						}}
					>
						Buat Kategori Menu Baru
					</button>
					{isFetchingMenuCategories && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Kategori Menu
						</div>
					)}

					{!isFetchingMenuCategories && (
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Nama Kategori Menu
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Lambang
									</th>
									<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
										Ubah
									</th>
								</tr>
							</thead>
							<tbody>
								{menuCategories.map((menuCategory) => (
									<tr
										key={menuCategory._id}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="p-1">
											{menuCategory.menuCategoryName}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											<i
												className={
													"fa-solid " +
													menuCategory.menuCategoryIcon
												}
											></i>
										</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												navigate(
													`/menuCategory/edit/${menuCategory._id}`
												);
											}}
										>
											<i className="fa-solid fa-pen-to-square"></i>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
									<td
										colSpan={3}
										className="text-center font-bold rounded-bl-sm rounded-br-sm p-1"
									></td>
								</tr>
							</tfoot>
						</table>
					)}
				</div>
				<h1 className={style.h1}>Daftar Menu</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					<button
						className={style.button}
						onClick={() => {
							navigate("/menu/create");
						}}
					>
						Buat Menu Baru
					</button>
					{isFetchingMenus && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Menu
						</div>
					)}
					{!isFetchingMenus && (
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Nama Menu
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Kategori Menu
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Harga Menu
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Resep
									</th>
									<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
										Ubah
									</th>
								</tr>
							</thead>
							<tbody>
								{menus.map((menu) => (
									<tr
										key={menu._id}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="p-1">{menu.menuName}</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{
												menu.menuCategoryId
													?.menuCategoryName
											}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{menu.menuPrice.toLocaleString(
												"id-ID"
											)}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{menu.currentRecipeId &&
												menu.currentRecipeId.stockUsed
													?.filter(
														(stock) => stock.stockId
													)
													.map(
														(stock) =>
															`${stock.quantity} ${stock.stockId.stockUnit} ${stock.stockId.stockName}`
													)
													.join(", ")}
										</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												navigate(
													`/menu/edit/${menu._id}`
												);
											}}
										>
											<i className="fa-solid fa-pen-to-square"></i>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
									<td
										colSpan={5}
										className="text-center font-bold rounded-bl-sm rounded-br-sm p-1"
									></td>
								</tr>
							</tfoot>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default MenuList;

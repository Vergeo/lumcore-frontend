import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Select from "react-select";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const EditMenu = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const [menuName, setMenuName] = useState("");
	const [menuCategory, setMenuCategory] = useState("");
	const [menuPrice, setMenuPrice] = useState("");
	const [selectedStocks, setSelectedStocks] = useState([]);

	const [menuCategoryOptions, setMenuCategoryOptions] = useState([]);
	const [stockOptions, setStockOptions] = useState([]);

	const [errorMessage, setErrorMessage] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchData = async () => {
		try {
			setIsFetching(true);

			const menuRes = await axiosPrivate.get(
				"menu/getMenu/" + params.menuId
			);
			setMenuName(menuRes.data.menuName);
			setMenuPrice(menuRes.data.menuPrice);

			const menuCategoryRes = await axiosPrivate.get(
				"menuCategory/getAllMenuCategories"
			);

			const options = menuCategoryRes.data.map((menuCategory) => ({
				value: menuCategory._id,
				label: menuCategory.menuCategoryName,
			}));
			setMenuCategoryOptions(options);

			const stockRes = await axiosPrivate.get("stock/getAllStocks");

			const options2 = stockRes.data.map((stock) => ({
				value: stock._id,
				label: stock.stockName,
				unit: stock.stockUnit,
				quantity: 0,
			}));
			setStockOptions(options2);

			if (menuRes.data.menuCategoryId) {
				setMenuCategory({
					value: menuRes.data.menuCategoryId._id,
					label: menuRes.data.menuCategoryId.menuCategoryName,
				});
			}

			if (menuRes.data.currentRecipeId?.stockUsed) {
				const selected = menuRes.data.currentRecipeId.stockUsed
					.filter((stock) => stock.stockId)
					.map((stock) => ({
						value: stock.stockId._id,
						label: stock.stockId.stockName,
						unit: stock.stockId.stockUnit,
						quantity: stock.quantity,
					}));
				setSelectedStocks(selected);
			}

			setIsFetching(false);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const updateMenu = async () => {
		try {
			setIsUpdating(true);
			const stockUsed = selectedStocks.map((stock) => ({
				stockId: stock.value,
				quantity: stock.quantity,
			}));

			var updatedMenu;

			if (stockUsed) {
				const updatedRecipe = {
					menuId: params.menuId,
					stockUsed,
				};

				const res2 = await axiosPrivate.post(
					"recipe/createRecipe",
					updatedRecipe
				);

				console.log(res2.data);

				updatedMenu = {
					id: params.menuId,
					index: 1,
					menuName,
					menuCategoryId: menuCategory.value,
					menuPrice,
					currentRecipeId: res2.data.object._id,
				};
			} else {
				updatedMenu = {
					id: params.menuId,
					index: 1,
					menuName,
					menuCategoryId: menuCategory.value,
					menuPrice,
				};
			}

			const res = await axiosPrivate.patch(
				"menu/updateMenu",
				updatedMenu
			);
			setIsUpdating(false);
			navigate("/menu");
		} catch (error) {
			console.log(error);
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsUpdating(false);
		}
	};

	const deleteMenu = async () => {
		try {
			setIsDeleting(true);
			const res = await axiosPrivate({
				method: "DELETE",
				url: "menu/deleteMenu",
				data: { id: params.menuId },
			});
			setIsDeleting(false);
			navigate("/menu");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsDeleting(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Ubah Menu</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					{isFetching ? (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Menu
						</div>
					) : (
						<form className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-5 gap-y-2 items-center">
							{errorMessage && (
								<div className={style.error + "col-span-2"}>
									{errorMessage}
								</div>
							)}
							<label htmlFor="menuName">Nama Menu</label>
							<input
								type="text"
								id="menuName"
								onChange={(e) => {
									setMenuName(e.target.value);
								}}
								value={menuName}
								className={style.p_muted + style.text_input}
							/>
							<label>Kategori Menu</label>
							<Select
								options={menuCategoryOptions}
								value={menuCategory}
								onChange={setMenuCategory}
								placeholder="Pilih Kategori"
							></Select>
							<label htmlFor="menuPrice">Harga Menu</label>
							<input
								type="text"
								id="menuPrice"
								onChange={(e) => {
									setMenuPrice(e.target.value);
								}}
								value={menuPrice}
								className={style.p_muted + style.text_input}
							/>
							<label>Resep Menu</label>
							<Select
								options={stockOptions}
								value={selectedStocks}
								onChange={setSelectedStocks}
								isMulti
								placeholder="Pilih Stok"
							></Select>
							<div className="col-start-2 flex flex-col gap-2">
								{selectedStocks.map((stock) => (
									<div key={stock.value}>
										<input
											type="number"
											name=""
											id={stock.value}
											className={
												style.text_input +
												"w-16 no-spinner text-center"
											}
											value={stock.quantity}
											onChange={(e) => {
												const value = Number(
													e.target.value
												);
												setSelectedStocks((prev) =>
													prev.map((s) =>
														s.value === stock.value
															? {
																	...s,
																	quantity:
																		value,
															  }
															: s
													)
												);
											}}
										/>
										<label
											htmlFor={stock.value}
											className="ml-1"
										>
											{stock.unit}
										</label>
										<label
											htmlFor={stock.value}
											className="ml-1"
										>
											{stock.label}
										</label>
									</div>
								))}
							</div>
						</form>
					)}
				</div>
				<div className="flex flex-row gap-2">
					<button
						className={
							(isUpdating ? style.button_muted : style.button) +
							"w-fit"
						}
						onClick={
							isUpdating
								? (e) => {
										e.preventDefault;
								  }
								: (e) => {
										e.preventDefault();
										updateMenu();
								  }
						}
					>
						{isUpdating ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menyimpan Perubahan Menu
							</div>
						) : (
							<div>Simpan Menu</div>
						)}
					</button>
					<button
						className={
							(isDeleting
								? style.button_red_muted
								: style.button_red) + "w-fit"
						}
						onClick={
							isDeleting
								? (e) => {
										e.preventDefault;
								  }
								: (e) => {
										e.preventDefault();
										deleteMenu();
								  }
						}
					>
						{isDeleting ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menghapus Menu
							</div>
						) : (
							<div>Hapus Menu</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditMenu;

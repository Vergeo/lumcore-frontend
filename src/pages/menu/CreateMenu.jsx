import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Select from "react-select";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const CreateMenu = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [menuName, setMenuName] = useState("");
	const [menuCategory, setMenuCategory] = useState("");
	const [menuPrice, setMenuUnit] = useState("");
	const [selectedStocks, setSelectedStocks] = useState([]);

	const [menuCategoryOptions, setMenuCategoryOptions] = useState([]);
	const [stockOptions, setStockOptions] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const fetchMenuCategories = async () => {
		try {
			const res = await axiosPrivate.get(
				"menuCategory/getAllMenuCategories"
			);

			const options = res.data.map((menuCategory) => ({
				value: menuCategory._id,
				label: menuCategory.menuCategoryName,
			}));
			setMenuCategoryOptions(options);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const fetchStocks = async () => {
		try {
			const res = await axiosPrivate.get("stock/getAllStocks");

			const options = res.data.map((stock) => ({
				value: stock._id,
				label: stock.stockName,
				unit: stock.stockUnit,
				quantity: 0,
			}));
			setStockOptions(options);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const createMenu = async () => {
		try {
			setIsCreating(true);
			const newMenu = {
				index: 1,
				menuName,
				menuCategoryId: menuCategory.value,
				menuPrice,
			};

			console.log(selectedStocks);

			const res = await axiosPrivate.post("menu/createMenu", newMenu);

			const stockUsed = selectedStocks.map((stock) => ({
				stockId: stock.value,
				quantity: stock.quantity,
			}));
			console.log(stockUsed);

			if (stockUsed.length) {
				const newRecipe = {
					menuId: res.data.object._id,
					stockUsed,
				};

				const res2 = await axiosPrivate.post(
					"recipe/createRecipe",
					newRecipe
				);

				const updatedMenu = {
					id: res.data.object._id,
					index: 1,
					menuName,
					menuCategoryId: menuCategory.value,
					menuPrice,
					currentRecipeId: res2.data.object._id,
				};

				const res3 = await axiosPrivate.patch(
					"menu/updateMenu",
					updatedMenu
				);
			}

			setIsCreating(false);
			navigate("/menu");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsCreating(false);
		}
	};

	useEffect(() => {
		fetchMenuCategories();
		fetchStocks();
	}, []);
	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Buat Menu Baru</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
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
							type="number"
							id="menuPrice"
							onChange={(e) => {
								setMenuUnit(e.target.value);
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
										value={stock.quantity}
										className={
											style.text_input +
											"w-16 no-spinner text-center"
										}
										onChange={(e) => {
											const value = Number(
												e.target.value
											);
											setSelectedStocks((prev) =>
												prev.map((s) =>
													s.value === stock.value
														? {
																...s,
																quantity: value,
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
				</div>
				<button
					className={
						(isCreating ? style.button_muted : style.button) +
						"w-fit"
					}
					onClick={
						isCreating
							? (e) => {
									e.preventDefault;
							  }
							: (e) => {
									e.preventDefault();
									createMenu();
							  }
					}
				>
					{isCreating ? (
						<div>
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Membuat Menu
						</div>
					) : (
						<div>Buat Menu</div>
					)}
				</button>
			</div>
		</div>
	);
};

export default CreateMenu;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Select from "react-select";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const CreateStock = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [stockName, setStockName] = useState("");
	const [stockCategory, setStockCategory] = useState("");
	const [stockUnit, setStockUnit] = useState("");

	const [stockCategoryOptions, setStockCategoryOptions] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const fetchStockCategories = async () => {
		try {
			const res = await axiosPrivate.get(
				"stockCategory/getAllStockCategories"
			);

			const options = res.data.map((stockCategory) => ({
				value: stockCategory._id,
				label: stockCategory.stockCategoryName,
			}));
			setStockCategoryOptions(options);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const createStock = async () => {
		try {
			setIsCreating(true);
			const newStock = {
				stockName,
				stockCategoryId: stockCategory.value,
				stockUnit,
			};

			const res = await axiosPrivate.post("stock/createStock", newStock);
			setIsCreating(false);
			navigate("/stock");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsCreating(false);
		}
	};

	useEffect(() => {
		fetchStockCategories();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Buat Stok Baru</h1>
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
						<label htmlFor="stockName">Nama Stok</label>
						<input
							type="text"
							id="stockName"
							onChange={(e) => {
								setStockName(e.target.value);
							}}
							value={stockName}
							className={style.p_muted + style.text_input}
						/>
						<label>Kategori Stok</label>
						<Select
							options={stockCategoryOptions}
							value={stockCategory}
							onChange={setStockCategory}
							placeholder="Pilih Kategori"
						></Select>
						<label htmlFor="stockUnit">Satuan Stok</label>
						<input
							type="text"
							id="stockUnit"
							onChange={(e) => {
								setStockUnit(e.target.value);
							}}
							value={stockUnit}
							className={style.p_muted + style.text_input}
						/>
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
									createStock();
							  }
					}
				>
					{isCreating ? (
						<div>
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Membuat Stok
						</div>
					) : (
						<div>Buat Stok</div>
					)}
				</button>
			</div>
		</div>
	);
};

export default CreateStock;

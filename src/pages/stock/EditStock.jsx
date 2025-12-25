import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Select from "react-select";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const EditStock = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const [stockName, setStockName] = useState("");
	const [stockCategory, setStockCategory] = useState("");
	const [stockUnit, setStockUnit] = useState("");
	const [stockCategoryOptions, setStockCategoryOptions] = useState([]);

	const [errorMessage, setErrorMessage] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchStock = async () => {
		try {
			setIsFetching(true);

			const res2 = await axiosPrivate.get(
				"stockCategory/getAllStockCategories"
			);

			const options = res2.data.map((stockCategory) => ({
				value: stockCategory._id,
				label: stockCategory.stockCategoryName,
			}));
			setStockCategoryOptions(options);

			const res = await axiosPrivate.get(
				"stock/getStock/" + params.stockId
			);
			setStockName(res.data.stockName);
			if (res.data.stockCategoryId) {
				setStockCategory({
					value: res.data.stockCategoryId._id,
					label: res.data.stockCategoryId.stockCategoryName,
				});
			}

			setStockUnit(res.data.stockUnit);

			setIsFetching(false);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const updateStock = async () => {
		try {
			setIsUpdating(true);
			const updatedStock = {
				id: params.stockId,
				stockName,
				stockCategoryId: stockCategory.value,
				stockUnit,
			};

			const res = await axiosPrivate.patch(
				"stock/updateStock",
				updatedStock
			);

			setIsUpdating(false);
			navigate("/stock");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsUpdating(false);
		}
	};

	const deleteStock = async () => {
		try {
			setIsDeleting(true);
			const res = await axiosPrivate({
				method: "DELETE",
				url: "stock/deleteStock",
				data: { id: params.stockId },
			});
			setIsDeleting(false);
			navigate("/stock");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsDeleting(false);
		}
	};

	useEffect(() => {
		fetchStock();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Ubah Stok</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					{isFetching ? (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Stok
						</div>
					) : (
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
										updateStock();
								  }
						}
					>
						{isUpdating ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menyimpan Perubahan Stok
							</div>
						) : (
							<div>Simpan Stok</div>
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
										deleteStock();
								  }
						}
					>
						{isDeleting ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menghapus Kateogri Stok
							</div>
						) : (
							<div>Hapus Stok</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditStock;

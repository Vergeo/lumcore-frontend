import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const EditStockCategory = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const [stockCategoryName, setStockCategoryName] = useState("");
	const [stockCategoryIcon, setStockCategoryIcon] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchStockCategory = async () => {
		try {
			setIsFetching(true);
			const res = await axiosPrivate.get(
				"stockCategory/getStockCategory/" + params.stockCategoryId
			);
			setStockCategoryName(res.data.stockCategoryName);
			setStockCategoryIcon(res.data.stockCategoryIcon);

			setIsFetching(false);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const updateStockCategory = async () => {
		try {
			setIsUpdating(true);
			const updatedStockCategory = {
				id: params.stockCategoryId,
				stockCategoryName,
				stockCategoryIcon,
			};

			const res = await axiosPrivate.patch(
				"stockCategory/updateStockCategory",
				updatedStockCategory
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

	const deleteStockCategory = async () => {
		try {
			setIsDeleting(true);
			const res = await axiosPrivate({
				method: "DELETE",
				url: "stockCategory/deleteStockCategory",
				data: { id: params.stockCategoryId },
			});
			setIsDeleting(false);
			navigate("/stock");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			console.log(error);
			setErrorMessage(error.response.data.message);
			setIsDeleting(false);
		}
	};

	useEffect(() => {
		fetchStockCategory();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Ubah Kategori Stok</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					{isFetching ? (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Kategori Stok
						</div>
					) : (
						<form className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-5 gap-y-2 items-center">
							{errorMessage && (
								<div className={style.error + "col-span-2"}>
									{errorMessage}
								</div>
							)}
							<label htmlFor="stockCategoryName">
								Nama Kategori Stok
							</label>
							<input
								type="text"
								id="stockCategoryName"
								onChange={(e) => {
									setStockCategoryName(e.target.value);
								}}
								value={stockCategoryName}
								className={style.p_muted + style.text_input}
							/>
							<label htmlFor="stockCategoryIcon">
								Lambang Kategori Stok
							</label>
							<div className="flex flex-row items-center gap-5">
								<input
									type="text"
									id="stockCategoryIcon"
									onChange={(e) => {
										setStockCategoryIcon(e.target.value);
									}}
									value={stockCategoryIcon}
									className={style.p_muted + style.text_input}
								/>
								<div className="h-full aspect-square bg-(--bg-dark) rounded-sm p-1">
									<i
										className={
											"fa-solid " + stockCategoryIcon
										}
									></i>
								</div>
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
										updateStockCategory();
								  }
						}
					>
						{isUpdating ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menyimpan Perubahan Kategori Stok
							</div>
						) : (
							<div>Simpan Kategori Stok</div>
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
										deleteStockCategory();
								  }
						}
					>
						{isDeleting ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menghapus Kateogri Stok
							</div>
						) : (
							<div>Hapus Kategori Stok</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditStockCategory;

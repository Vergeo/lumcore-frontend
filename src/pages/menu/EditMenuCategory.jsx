import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const EditMenuCategory = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const [menuCategoryName, setMenuCategoryName] = useState("");
	const [menuCategoryIcon, setMenuCategoryIcon] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchMenuCategory = async () => {
		try {
			setIsFetching(true);
			const res = await axiosPrivate.get(
				"menuCategory/getMenuCategory/" + params.menuCategoryId
			);
			setMenuCategoryName(res.data.menuCategoryName);
			setMenuCategoryIcon(res.data.menuCategoryIcon);

			setIsFetching(false);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const updateMenuCategory = async () => {
		try {
			setIsUpdating(true);
			const updatedMenuCategory = {
				id: params.menuCategoryId,
				menuCategoryName,
				menuCategoryIcon,
			};

			const res = await axiosPrivate.patch(
				"menuCategory/updateMenuCategory",
				updatedMenuCategory
			);
			setIsUpdating(false);
			navigate("/menu");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsUpdating(false);
		}
	};

	const deleteMenuCategory = async () => {
		try {
			setIsDeleting(true);
			const res = await axiosPrivate({
				method: "DELETE",
				url: "menuCategory/deleteMenuCategory",
				data: { id: params.menuCategoryId },
			});
			setIsDeleting(false);
			navigate("/menu");
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
		fetchMenuCategory();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Ubah Kategori Menu</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					{isFetching ? (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Kategori Menu
						</div>
					) : (
						<form className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-5 gap-y-2 items-center">
							{errorMessage && (
								<div className={style.error + "col-span-2"}>
									{errorMessage}
								</div>
							)}
							<label htmlFor="menuCategoryName">
								Nama Kategori Menu
							</label>
							<input
								type="text"
								id="menuCategoryName"
								onChange={(e) => {
									setMenuCategoryName(e.target.value);
								}}
								value={menuCategoryName}
								className={style.p_muted + style.text_input}
							/>
							<label htmlFor="menuCategoryIcon">
								Lambang Kategori Stok
							</label>
							<div className="flex flex-row items-center gap-5">
								<input
									type="text"
									id="menuCategoryIcon"
									onChange={(e) => {
										setStockCategoryIcon(e.target.value);
									}}
									value={menuCategoryIcon}
									className={style.p_muted + style.text_input}
								/>
								<div className="h-full aspect-square bg-(--bg-dark) rounded-sm p-1">
									<i
										className={
											"fa-solid " + menuCategoryIcon
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
										updateMenuCategory();
								  }
						}
					>
						{isUpdating ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menyimpan Perubahan Kategori Menu
							</div>
						) : (
							<div>Simpan Kategori Menu</div>
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
										deleteMenuCategory();
								  }
						}
					>
						{isDeleting ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menghapus Kateogri Menu
							</div>
						) : (
							<div>Hapus Kategori Menu</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditMenuCategory;

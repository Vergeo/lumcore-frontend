import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const CreateMenuCategory = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [menuCategoryName, setMenuCategoryName] = useState("");
	const [menuCategoryIcon, setMenuCategoryIcon] = useState(
		"fa-table-cells-large"
	);
	const [errorMessage, setErrorMessage] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const createMenuCategory = async () => {
		try {
			setIsCreating(true);
			const newMenuCategory = {
				menuCategoryName,
				menuCategoryIcon,
			};

			const res = await axiosPrivate.post(
				"menuCategory/createMenuCategory",
				newMenuCategory
			);
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

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Buat Kategori Menu Baru</h1>
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
									setMenuCategoryIcon(e.target.value);
								}}
								value={menuCategoryIcon}
								className={style.p_muted + style.text_input}
							/>
							<div className="h-full aspect-square bg-(--bg-dark) rounded-sm p-1">
								<i
									className={"fa-solid " + menuCategoryIcon}
								></i>
							</div>
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
									createMenuCategory();
							  }
					}
				>
					{isCreating ? (
						<div>
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Membuat Kategori Menu
						</div>
					) : (
						<div>Buat Kategori Menu</div>
					)}
				</button>
			</div>
		</div>
	);
};

export default CreateMenuCategory;

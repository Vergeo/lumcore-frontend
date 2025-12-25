import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const EditRole = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const [roleName, setRoleName] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchRole = async () => {
		try {
			setIsFetching(true);
			const res = await axiosPrivate.get("role/getRole/" + params.roleId);
			setRoleName(res.data.roleName);

			setIsFetching(false);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const updateRole = async () => {
		try {
			setIsUpdating(true);
			const updatedRole = {
				id: params.roleId,
				roleName,
			};

			const res = await axiosPrivate.patch(
				"role/updateRole",
				updatedRole
			);
			setIsUpdating(false);
			navigate("/employee");
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
			setErrorMessage(error.response.data.message);
			setIsUpdating(false);
		}
	};

	const deleteRole = async () => {
		try {
			setIsDeleting(true);
			const res = await axiosPrivate({
				method: "DELETE",
				url: "role/deleteRole",
				data: { id: params.roleId },
			});
			setIsDeleting(false);
			navigate("/employee");
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
		fetchRole();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Ubah Peran</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					{isFetching ? (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Peran
						</div>
					) : (
						<form className="flex gap-2 flex-col">
							{errorMessage && (
								<div className={style.error}>
									{errorMessage}
								</div>
							)}
							<div className="flex w-full justify-between items-center gap-10">
								<label htmlFor="roleName">Nama Peran</label>
								<input
									type="text"
									id="roleName"
									onChange={(e) => {
										setRoleName(e.target.value);
									}}
									value={roleName}
									className={style.p_muted + style.text_input}
								/>
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
										updateRole();
								  }
						}
					>
						{isUpdating ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menyimpan Perubahan Peran
							</div>
						) : (
							<div>Simpan Peran</div>
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
										deleteRole();
								  }
						}
					>
						{isDeleting ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menghapus Peran
							</div>
						) : (
							<div>Hapus Peran</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditRole;

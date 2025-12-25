import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const CreateRole = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [roleName, setRoleName] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const createRole = async () => {
		try {
			setIsCreating(true);
			const newRole = {
				roleName,
			};

			const res = await axiosPrivate.post("role/createRole", newRole);
			setIsCreating(false);
			navigate("/employee");
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
				<h1 className={style.h1}>Buat Peran Baru</h1>
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
									createRole();
							  }
					}
				>
					{isCreating ? (
						<div>
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Membuat Peran
						</div>
					) : (
						<div>Buat Peran</div>
					)}
				</button>
			</div>
		</div>
	);
};

export default CreateRole;

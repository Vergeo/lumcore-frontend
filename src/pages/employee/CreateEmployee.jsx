import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Select from "react-select";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const CreateEmployee = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [employeeName, setEmployeeName] = useState("");
	const [employeeRoles, setEmployeeRoles] = useState([]);

	const [roles, setRoles] = useState([]);

	const [errorMessage, setErrorMessage] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const fetchRoles = async () => {
		try {
			const res = await axiosPrivate.get("role/getAllRoles");

			const options = res.data.map((role) => ({
				value: role._id,
				label: role.roleName,
			}));
			setRoles(options);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		fetchRoles();
	}, []);

	const createEmployee = async () => {
		try {
			setIsCreating(true);

			const selected = employeeRoles.map((role) => role.value);
			const newEmployee = {
				username,
				password,
				employeeName,
				employeeRoles: selected,
			};

			const res = await axiosPrivate.post(
				"employee/createEmployee",
				newEmployee
			);
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
				<h1 className={style.h1}>Buat Karyawan Baru</h1>
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
						<label htmlFor="employeeName">Nama Karyawan</label>
						<input
							type="text"
							id="employeeName"
							onChange={(e) => {
								setEmployeeName(e.target.value);
							}}
							value={employeeName}
							className={style.p_muted + style.text_input}
						/>
						<label htmlFor="username">Nama Pengguna</label>
						<input
							type="text"
							id="username"
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							value={username}
							className={style.p_muted + style.text_input}
						/>
						<label htmlFor="password">Kata Sandi</label>
						<input
							type="text"
							id="password"
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							value={password}
							className={style.p_muted + style.text_input}
						/>
						<label>Peran Karyawan</label>
						<Select
							options={roles}
							isMulti
							value={employeeRoles}
							onChange={setEmployeeRoles}
							placeholder="Pilih Peran"
						></Select>
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
									createEmployee();
							  }
					}
				>
					{isCreating ? (
						<div>
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Membuat Karyawan
						</div>
					) : (
						<div>Buat Karyawan</div>
					)}
				</button>
			</div>
		</div>
	);
};

export default CreateEmployee;

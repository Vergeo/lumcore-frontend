import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Select from "react-select";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const EditEmployee = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [employeeName, setEmployeeName] = useState("");
	const [employeeRoles, setEmployeeRoles] = useState([]);
	const [active, setActive] = useState(false);

	const [roles, setRoles] = useState([]);

	const [errorMessage, setErrorMessage] = useState("");
	const [isFetching, setIsFetching] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchData = async () => {
		try {
			setIsFetching(true);
			const res = await axiosPrivate.get("role/getAllRoles");

			const options = res.data.map((role) => ({
				value: role._id,
				label: role.roleName,
			}));
			setRoles(options);

			const res2 = await axiosPrivate.get(
				"employee/getEmployee/" + params.employeeId
			);

			setUsername(res2.data.username);
			setPassword(res2.data.password);
			setEmployeeName(res2.data.employeeName);
			setActive(res2.data.active);

			const selected = res2.data.employeeRoles.map((role) => ({
				value: role._id,
				label: role.roleName,
			}));
			setEmployeeRoles(selected);
			setIsFetching(false);
		} catch (error) {
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const updateEmployee = async () => {
		try {
			setIsUpdating(true);
			const selected = employeeRoles.map((role) => role.value);
			let updatedEmployee = {
				id: params.employeeId,
				username,
				password,
				employeeName,
				employeeRoles: selected,
				active,
			};

			const res = await axiosPrivate.patch(
				"employee/updateEmployee",
				updatedEmployee
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

	const deleteEmployee = async () => {
		try {
			setIsDeleting(true);
			const res = await axiosPrivate({
				method: "DELETE",
				url: "employee/deleteEmployee",
				data: { id: params.employeeId },
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
		fetchData();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Ubah Karyawan</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					{isFetching ? (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Karyawan
						</div>
					) : (
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
								placeholder="Kosongkan Jika Sama"
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
							<label>Status</label>
							<div className="flex gap-5">
								<div className="flex flex-row gap-1">
									<input
										type="radio"
										name="status"
										id="active"
										value="true"
										className="hidden"
										checked={active}
										onChange={(e) => {
											setActive(true);
										}}
									/>
									<label
										htmlFor="active"
										className={
											(active
												? style.radio_checked
												: style.radio) + "px-5"
										}
									>
										Aktif
									</label>
								</div>
								<div className="flex flex-row gap-1">
									<input
										type="radio"
										name="status"
										id="not-active"
										value="false"
										className="hidden"
										checked={!active}
										onChange={(e) => {
											setActive(false);
										}}
									/>
									<label
										htmlFor="not-active"
										className={
											(!active
												? style.radio_checked
												: style.radio) + "px-5"
										}
									>
										Tidak Aktif
									</label>
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
										updateEmployee();
								  }
						}
					>
						{isUpdating ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menyimpan Perubahan Karyawan
							</div>
						) : (
							<div>Simpan Karyawan</div>
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
										deleteEmployee();
								  }
						}
					>
						{isDeleting ? (
							<div>
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menghapus Karyawan
							</div>
						) : (
							<div>Hapus Karyawan</div>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditEmployee;

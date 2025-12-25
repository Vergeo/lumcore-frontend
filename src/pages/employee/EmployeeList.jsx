import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const RoleList = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [roles, setRoles] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [isFetchingRoles, setIsFetchingRoles] = useState(true);
	const [isFetchingEmployees, setIsFetchingEmployees] = useState(true);

	const fetchRoles = async () => {
		try {
			setIsFetchingRoles(true);
			const res = await axiosPrivate.get("role/getAllRoles");
			setRoles(res.data);
			setIsFetchingRoles(false);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	const fetchEmployees = async () => {
		try {
			setIsFetchingEmployees(true);
			const res = await axiosPrivate.get("employee/getAllEmployees");
			setEmployees(res.data);
			setIsFetchingEmployees(false);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	const parseEmployeeRoles = (employeeRoles) => {
		const roles2 = employeeRoles.map((role) => role.roleName);
		return roles2.join(", ");
	};

	useEffect(() => {
		fetchRoles();
		fetchEmployees();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Daftar Peran</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					<button
						className={style.button}
						onClick={() => {
							navigate("/role/create");
						}}
					>
						Buat Peran Baru
					</button>
					{isFetchingRoles && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Karyawan
						</div>
					)}

					{!isFetchingRoles && (
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Nama Peran
									</th>
									<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
										Ubah
									</th>
								</tr>
							</thead>
							<tbody>
								{roles.map((role) => (
									<tr
										key={role._id}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="p-1">{role.roleName}</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												navigate(
													`/role/edit/${role._id}`
												);
											}}
										>
											<i className="fa-solid fa-pen-to-square"></i>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
									<td
										colSpan={2}
										className="text-center font-bold rounded-bl-sm rounded-br-sm p-1"
									></td>
								</tr>
							</tfoot>
						</table>
					)}
				</div>
				<h1 className={style.h1}>Daftar Karyawan</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					<button
						className={style.button}
						onClick={() => {
							navigate("/employee/create");
						}}
					>
						Buat Karyawan Baru
					</button>
					{isFetchingEmployees && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Karyawan
						</div>
					)}
					{!isFetchingEmployees && (
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Nama Karyawan
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Username
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Peran
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Status
									</th>
									<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
										Ubah
									</th>
								</tr>
							</thead>
							<tbody>
								{employees.map((employee) => (
									<tr
										key={employee._id}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="p-1">
											{employee.employeeName}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{employee.username}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{parseEmployeeRoles(
												employee.employeeRoles
											)}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{employee.active
												? "Aktif"
												: "Tidak Aktif"}
										</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												navigate(
													`/employee/edit/${employee._id}`
												);
											}}
										>
											<i className="fa-solid fa-pen-to-square"></i>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
									<td
										colSpan={5}
										className="text-center font-bold rounded-bl-sm rounded-br-sm p-1"
									></td>
								</tr>
							</tfoot>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default RoleList;

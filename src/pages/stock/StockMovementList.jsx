import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const RoleList = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();
	const [isFetching, setIsFetching] = useState(false);
	const [stockMovements, setStockMovements] = useState([]);

	const fetchStockMovements = async () => {
		try {
			setIsFetching(true);
			const res = await axiosPrivate.get(
				"stockMovement/getAllStockMovements"
			);
			setStockMovements(res.data);
			setIsFetching(false);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		fetchStockMovements();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Daftar Perubahan Stok</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					{isFetching && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Perubahan Stok
						</div>
					)}
					{!isFetching && (
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Tanggal
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Waktu
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Stok
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Perubahan
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Tipe
									</th>
									<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
										Komen
									</th>
								</tr>
							</thead>
							<tbody>
								{stockMovements?.map((movement) => (
									<tr
										key={movement._id}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="rounded-tl-sm p-1">
											{new Date(
												movement.movementDate
											).toLocaleString("id-ID", {
												year: "numeric",
												month: "numeric",
												day: "numeric",
											})}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{new Date(
												movement.movementDate
											).toLocaleString("en-US", {
												hour: "numeric",
												minute: "numeric",
												second: "numeric",
												hour12: false,
											})}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{movement.stockId.stockName}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{movement.stockQuantityChange +
												movement.stockId.stockUnit}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{movement.movementType}
										</td>
										<td className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
											{movement.comment}
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
									<td
										colSpan={6}
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

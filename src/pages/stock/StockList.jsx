import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";

const StockList = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [stockCategories, setStockCategories] = useState([]);
	const [stocks, setStocks] = useState([]);
	const [isFetchingStockCategories, setIsFetchingStockCategories] =
		useState(true);
	const [isFetchingStocks, setIsFetchingStocks] = useState(true);

	const fetchStockCategories = async () => {
		try {
			setIsFetchingStockCategories(true);
			const res = await axiosPrivate.get(
				"stockCategory/getAllStockCategories"
			);
			setStockCategories(res.data);
			setIsFetchingStockCategories(false);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	const fetchStocks = async () => {
		try {
			setIsFetchingStocks(true);
			const res = await axiosPrivate.get("stock/getAllStocks");
			setStocks(res.data);
			setIsFetchingStocks(false);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		fetchStockCategories();
		fetchStocks();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Daftar Kategori Stok</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					<button
						className={style.button}
						onClick={() => {
							navigate("/stockCategory/create");
						}}
					>
						Buat Kategori Stok Baru
					</button>
					{isFetchingStockCategories && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Kategori Stok
						</div>
					)}

					{!isFetchingStockCategories && (
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Nama Kategori Stok
									</th>
									<th className="border-l-1 border-(--bg-light)">
										Lambang
									</th>
									<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
										Ubah
									</th>
								</tr>
							</thead>
							<tbody>
								{stockCategories.map((stockCategory) => (
									<tr
										key={stockCategory._id}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="p-1">
											{stockCategory.stockCategoryName}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											<i
												className={
													"fa-solid " +
													stockCategory.stockCategoryIcon
												}
											></i>
										</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												navigate(
													`/stockCategory/edit/${stockCategory._id}`
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
										colSpan={3}
										className="text-center font-bold rounded-bl-sm rounded-br-sm p-1"
									></td>
								</tr>
							</tfoot>
						</table>
					)}
				</div>
				<h1 className={style.h1}>Daftar Stok</h1>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					<button
						className={style.button}
						onClick={() => {
							navigate("/stock/create");
						}}
					>
						Buat Stok Baru
					</button>
					{isFetchingStocks && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Stok
						</div>
					)}
					{!isFetchingStocks && (
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Nama Stok
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Kategori Stok
									</th>
									<th className="border-l-1 border-(--bg-light) p-1">
										Satuan
									</th>
									<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
										Ubah
									</th>
								</tr>
							</thead>
							<tbody>
								{stocks.map((stock) => (
									<tr
										key={stock._id}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="p-1">
											{stock.stockName}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{
												stock.stockCategoryId
													?.stockCategoryName
											}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{stock.stockUnit}
										</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												navigate(
													`/stock/edit/${stock._id}`
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
										colSpan={4}
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

export default StockList;

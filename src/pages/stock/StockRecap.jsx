import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { style } from "../../styles/style";
import useAuth from "../../hooks/useAuth";

const StockRecap = () => {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const { auth } = useAuth();
	const [manager, setManager] = useState(false);

	const [stocks, setStocks] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));

	const fetchData = async () => {
		try {
			setIsLoading(true);

			const res = await axiosPrivate.get("stock/getStockRecap/" + date);

			setStocks(res.data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		setManager(auth?.roles?.includes("Manager"));
		fetchData();
	}, []);

	useEffect(() => {
		fetchData();
	}, [date]);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex p-6 gap-6 flex-col">
				<div className="flex justify-between">
					<h1 className={style.h1}>Rekap Stok</h1>
					<input
						type="date"
						name=""
						id=""
						onChange={(e) => {
							setDate(
								new Date(e.target.value).toLocaleDateString(
									"en-CA"
								)
							);
						}}
						value={date}
						className="bg-(--bg-light) hover:bg-(--accent-light) transition-all ease-in p-2 w-fit rounded-sm cursor-pointer shadow-md"
					/>
				</div>

				<div className="flex flex-col gap-6">
					<div
						className={
							style.card +
							"w-full p-6 bg-(--bg-light) items-start gap-2"
						}
					>
						<div className="flex gap-2">
							<button
								className={style.button}
								onClick={() => {
									navigate("/stock/entry");
								}}
							>
								Masukan Stok
							</button>
							<button
								className={style.button}
								onClick={() => {
									navigate("/stock/adjust");
								}}
							>
								Sesuaikan Stok
							</button>
						</div>
						{isLoading ? (
							<div className="flex justify-start items-center">
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Mengambil Data Stok
							</div>
						) : (
							<table className="w-full">
								<thead>
									<tr className="bg-(--bg-dark) text-(--text)">
										<th className="rounded-tl-sm p-1">
											Stok
										</th>
										<th className="border-l-1 border-(--bg-light) p-1 rounded-tr-sm">
											Banyak
										</th>
									</tr>
								</thead>
								<tbody>
									{stocks.map((stock) => (
										<tr
											key={stock.stockName}
											className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
										>
											<td className="p-1">
												{stock.stockName}
											</td>
											<td className="border-l-1 border-(--bg-light) p-1">
												{stock.quantity +
													" " +
													stock.stockUnit}
											</td>
										</tr>
									))}
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-sm rounded-br-sm p-1"
										></td>
									</tr>
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default StockRecap;

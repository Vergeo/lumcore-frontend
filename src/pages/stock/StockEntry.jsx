import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const StockIn = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const { auth } = useAuth();

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isFinishing, setIsFinishing] = useState(false);

	const [stockCategories, setStockCategories] = useState([]);
	const [selectedStock, setSelectedStock] = useState([]);
	const [currentCategory, setCurrentCategory] = useState({});

	const [errorMessage, setErrorMessage] = useState("");

	const fetchStockData = async () => {
		try {
			setIsLoading(true);

			const [stockCategoryRes, stockRes] = await Promise.all([
				axiosPrivate.get("stockCategory/getAllStockCategories"),
				axiosPrivate.get("stock/getAllStocks"),
			]);

			setStockCategories(
				stockCategoryRes.data.map((stockCategory) => {
					const stockCount = stockRes.data.filter(
						(stock) =>
							stock.stockCategoryId._id === stockCategory._id
					).length;

					return { ...stockCategory, quantity: stockCount };
				})
			);

			setSelectedStock(
				stockRes.data.map((stock) => ({
					stockId: stock._id,
					stockName: stock.stockName,
					stockCategoryName: stock.stockCategoryId?.stockCategoryName,
					stockUnit: stock.stockUnit,
					quantity: 0,
				}))
			);

			setCurrentCategory(stockCategoryRes.data[0]);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		fetchStockData();
	}, []);

	const saveStockEntry = async () => {
		try {
			setErrorMessage("");
			setIsSaving(true);

			selectedStock.forEach(async (stock) => {
				if (stock.quantity > 0) {
					const newStockMovement = {
						stockId: stock.stockId,
						stockQuantityChange: stock.quantity,
						movementDate: new Date(),
						movementType: "Stock Entry",
						employeeId: auth.userId,
					};
					const stockMovementRes = await axiosPrivate.post(
						"stockMovement/createStockMovement",
						newStockMovement
					);
				}
			});

			setIsSaving(false);
			navigate("/stock/recap");
		} catch (error) {
			console.log(error);
			setErrorMessage(
				error?.response?.data?.message || "Error. Silahkan coba lagi."
			);
			setIsSaving(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const updateStockQuantity = (stockName, newQuantity) => {
		setSelectedStock((prev) =>
			prev.map((item) =>
				item.stockName === stockName
					? { ...item, quantity: newQuantity }
					: item
			)
		);
	};

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex p-6 gap-6">
				<div className="w-2/3 gap-5 flex flex-col">
					<h1 className={style.h1}>Masukan Stok</h1>

					{isLoading && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Stok
						</div>
					)}

					{!isLoading && (
						<div className="w-full flex flex-col gap-6">
							<div className="w-full mb-2 gap-3 flex flex-wrap">
								{stockCategories.map((stockCategory) => {
									return currentCategory.stockCategoryName ===
										stockCategory.stockCategoryName ? (
										<div
											key={
												stockCategory.stockCategoryName
											}
											className="flex min-w-50 grow p-2 gap-2 bg-(--accent) text-(--bg-light) shadow-sm rounded-sm transition-all ease-in"
										>
											<div className="transition-all ease-in h-full aspect-square flex justify-center items-center bg-(--bg) rounded-sm">
												<i
													className={
														"text-(--accent) transition-all ease-in fa-solid " +
														stockCategory.stockCategoryIcon
													}
												></i>
											</div>
											<div>
												<div className="font-bold">
													{
														stockCategory.stockCategoryName
													}
												</div>
												<div
													className={
														"text-sm text-(--bg-dark)"
													}
												>
													{stockCategory.quantity}{" "}
													Barang
												</div>
											</div>
										</div>
									) : (
										<div
											key={
												stockCategory.stockCategoryName
											}
											className="group flex p-2 gap-2 min-w-50 grow bg-(--bg-light) shadow-sm rounded-sm cursor-pointer hover:bg-(--accent-light) transition-all ease-in"
											onClick={() => {
												setCurrentCategory(
													stockCategory
												);
											}}
										>
											<div className="group-hover:bg-(--bg-dark) transition-all ease-in h-full aspect-square flex justify-center items-center bg-(--bg) rounded-sm">
												<i
													className={
														"group-hover:text-(--accent) transition-all ease-in fa-solid " +
														stockCategory.stockCategoryIcon
													}
												></i>
											</div>
											<div>
												<div className="font-bold">
													{
														stockCategory.stockCategoryName
													}
												</div>
												<div
													className={
														style.p_muted +
														"text-sm"
													}
												>
													{stockCategory.quantity}{" "}
													Barang
												</div>
											</div>
										</div>
									);
								})}
							</div>
							<div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-3">
								{selectedStock.map((stock) => {
									if (
										stock.stockCategoryName ===
										currentCategory.stockCategoryName
									) {
										return (
											<div
												key={stock.stockName}
												className={
													style.card +
													"bg-(--bg-light) p-2 flex-row justify-start gap-2"
												}
											>
												<div className="h-full aspect-square bg-(--bg) flex justify-center items-center">
													<i
														className={
															"fa-2xl fa-solid " +
															currentCategory.stockCategoryIcon
														}
													></i>
												</div>
												<div>
													<div className="text-lg text">
														{stock.stockName}
													</div>

													<input
														className={
															style.text_input +
															"no-spinner"
														}
														type="number"
														name=""
														id=""
														value={stock.quantity}
														onChange={(e) =>
															updateStockQuantity(
																stock.stockName,
																Number(
																	e.target
																		.value
																)
															)
														}
													/>
												</div>
											</div>
										);
									}
								})}
							</div>
						</div>
					)}
				</div>
				<div
					className={
						"w-1/3 bg-(--bg-light) gap-2 justify-start p-3 items-start" +
						style.card
					}
				>
					<div className="w-full flex flex-col gap-2">
						{errorMessage && (
							<div className={style.error}>{errorMessage}</div>
						)}
					</div>

					<div className="w-full flex flex-col gap-2">
						<h3 className={style.h3}>Daftar Masukan Stok</h3>
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Nama Stok
									</th>
									<th className="border-l-1 border-(--bg-light) p-1 rounded-tr-sm">
										Banyak
									</th>
								</tr>
							</thead>
							<tbody>
								{selectedStock.map((stock) => {
									if (stock.quantity > 0) {
										return (
											<tr
												key={stock.stockName}
												className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
											>
												<td className="p-1">
													{stock.stockName}
												</td>
												<td className="border-l-1 border-(--bg-light) p-1">
													{stock.quantity.toLocaleString(
														"id-ID"
													) +
														" " +
														stock.stockUnit}
												</td>
											</tr>
										);
									}
								})}
							</tbody>
						</table>
						<div
							className={
								!isSaving && !isFinishing
									? style.button + "w-fit"
									: style.button_muted + "w-fit"
							}
							onClick={() => {
								!isSaving && !isFinishing
									? saveStockEntry()
									: () => {};
							}}
						>
							{!isSaving ? (
								"Simpan Masukan Stok"
							) : (
								<div className="flex justify-center items-center">
									<i className="fa-solid fa-cog fa-spin mr-2"></i>
									Menyimpan Stok
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StockIn;

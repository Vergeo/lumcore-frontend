import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { style } from "../../styles/style";
import useAuth from "../../hooks/useAuth";

const OrderRecap = () => {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const { auth } = useAuth();
	const [manager, setManager] = useState(false);

	const [isLoading, setIsLoading] = useState(true);

	const [onlineSales, setOnlineSales] = useState([]);
	const [offlineSales, setOfflineSales] = useState([]);

	const [totalCash, setTotalCash] = useState(0);
	const [totalQRIS, setTotalQRIS] = useState(0);
	const [totalTransfer, setTotalTransfer] = useState(0);
	const [totalSale, setTotalSale] = useState(0);
	const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [resItems, resOrders] = await Promise.all([
				axiosPrivate.get("menu/getAllMenus"),
				axiosPrivate.get("order/getOrderByDate/" + date),
			]);

			// resItems.data.sort(function (a, b) {
			// 	return a.index - b.index;
			// });

			const tempOnline = resItems.data.map((menu) => ({
				menuName: menu.menuName,
				quantity: 0,
			}));

			const tempOffline = resItems.data.map((menu) => ({
				menuName: menu.menuName,
				quantity: 0,
				totalPrice: 0,
			}));

			var tempCash = 0;
			var tempQRIS = 0;
			var tempTransfer = 0;
			var tempTotal = 0;

			resOrders.data.forEach((order) => {
				if (order.orderStatus === "finished") {
					if (order.orderType === "Online") {
						order.orderDetail.forEach((menu) => {
							const idx = tempOnline.findIndex(
								(i) => i.menuName === menu.menuId.menuName
							);
							if (idx !== -1) {
								tempOnline[idx] = {
									...tempOnline[idx],
									quantity:
										tempOnline[idx].quantity +
										menu.quantity,
								};
							}
						});
					} else if (order.orderType === "Offline") {
						order.orderDetail.forEach((menu) => {
							const idx = tempOffline.findIndex(
								(i) => i.menuName === menu.menuId.menuName
							);
							if (idx !== -1) {
								tempTotal += menu.quantity * menu.menuPrice;
								if (order.orderPaymentMethod === "Cash")
									tempCash += menu.quantity * menu.menuPrice;
								else if (order.orderPaymentMethod === "QRIS")
									tempQRIS += menu.quantity * menu.menuPrice;
								else if (
									order.orderPaymentMethod === "Transfer"
								)
									tempTransfer +=
										menu.quantity * menu.menuPrice;
								tempOffline[idx] = {
									...tempOffline[idx],
									quantity:
										tempOffline[idx].quantity +
										menu.quantity,
									totalPrice:
										tempOffline[idx].totalPrice +
										menu.quantity * menu.menuPrice,
								};
							}
						});
					}
				}
			});

			setOfflineSales(tempOffline);
			setOnlineSales(tempOnline);
			setTotalCash(tempCash);
			setTotalQRIS(tempQRIS);
			setTotalTransfer(tempTransfer);
			setTotalSale(tempTotal);
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
					<h1 className={style.h1}>Rekap Penjualan</h1>
					{manager && (
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
					)}
				</div>
				{isLoading ? (
					<div className="flex justify-start items-center">
						<i className="fa-solid fa-cog fa-spin mr-2"></i>
						Mengambil Data Pesanan
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<div
							className={
								style.card +
								"w-full p-6 bg-(--bg-light) items-start gap-2"
							}
						>
							<h2 className={style.h2}>Penjualan Offline</h2>
							<table className="w-full">
								<thead>
									<tr className="bg-(--bg-dark) text-(--text)">
										<th className="rounded-tl-sm p-1">
											Item
										</th>
										<th className="border-l-1 border-(--bg-light) p-1">
											Banyak
										</th>
										<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
											Harga
										</th>
									</tr>
								</thead>
								<tbody>
									{offlineSales.map((menu) => {
										if (menu.quantity > 0) {
											return (
												<tr
													key={menu.menuName}
													className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
												>
													<td className="p-1">
														{menu.menuName}
													</td>
													<td className="border-l-1 border-(--bg-light) p-1">
														{menu.quantity}
													</td>
													<td className="border-l-1 border-(--bg-light) p-1">
														{menu.totalPrice.toLocaleString(
															"id-ID"
														)}
													</td>
												</tr>
											);
										}
									})}
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-sm p-1"
										>
											Total
										</td>
										<td className="border-l-1 p-1 border-(--bg-light) text-center rounded-br-sm font-bold">
											{totalSale.toLocaleString("id-ID")}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div
							className={
								style.card +
								"w-full p-6 bg-(--bg-light) items-start gap-2"
							}
						>
							<h2 className={style.h2}>Penjualan Online</h2>
							<table className="w-full">
								<thead>
									<tr className="bg-(--bg-dark) text-(--text)">
										<th className="rounded-tl-sm p-1">
											Item
										</th>
										<th className="border-l-1 border-(--bg-light) p-1 rounded-tr-sm">
											Banyak
										</th>
									</tr>
								</thead>
								<tbody>
									{onlineSales.map((menu) => {
										if (menu.quantity > 0) {
											return (
												<tr
													key={menu.menuName}
													className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
												>
													<td className="p-1">
														{menu.menuName}
													</td>
													<td className="border-l-1 border-(--bg-light) p-1">
														{menu.quantity}
													</td>
												</tr>
											);
										}
									})}
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-sm p-1 rounded-br-sm"
										></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div
							className={
								style.card +
								"w-full p-6 bg-(--bg-light) items-start gap-2"
							}
						>
							<h2 className={style.h2}>Distribusi Pembayaran</h2>
							<table className="w-full">
								<thead>
									<tr className="bg-(--bg-dark) text-(--text)">
										<th className="rounded-tl-sm p-1">
											Metode
										</th>
										<th className="border-l-1 border-(--bg-light) p-1 rounded-tr-sm">
											Banyak
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="border-t-1 border-(--bg-light) bg-(--bg) text-center">
										<td className="p-1">Cash</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{totalCash.toLocaleString("id-ID")}
										</td>
									</tr>
									<tr className="border-t-1 border-(--bg-light) bg-(--bg) text-center">
										<td className="p-1">QRIS</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{totalQRIS.toLocaleString("id-ID")}
										</td>
									</tr>
									<tr className="border-t-1 border-(--bg-light) bg-(--bg) text-center">
										<td className="p-1">Transfer</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{totalTransfer.toLocaleString(
												"id-ID"
											)}
										</td>
									</tr>
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td className="p-1 text-center font-bold rounded-bl-sm">
											Total
										</td>
										<td className="border-l-1 border-(--bg-light) p-1 text-center font-bold rounded-br-sm">
											{totalSale.toLocaleString("id-ID")}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderRecap;

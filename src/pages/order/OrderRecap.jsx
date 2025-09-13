import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { style } from "../../styles/style";

const OrderRecap = () => {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true);

	const [onlineSales, setOnlineSales] = useState([]);
	const [offlineSales, setOfflineSales] = useState([]);

	const [totalCash, setTotalCash] = useState(0);
	const [totalQRIS, setTotalQRIS] = useState(0);
	const [totalTransfer, setTotalTransfer] = useState(0);
	const [totalSale, setTotalSale] = useState(0);
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [resItems, resOrders] = await Promise.all([
				axiosPrivate.get("items"),
				axiosPrivate.get("sales"),
			]);

			const today = new Date(date);
			today.setHours(0, 0, 0, 0);

			const tempOnline = resItems.data.map((item) => ({
				name: item.name,
				quantity: 0,
			}));

			const tempOffline = resItems.data.map((item) => ({
				name: item.name,
				quantity: 0,
				totalPrice: 0,
			}));

			var tempCash = 0;
			var tempQRIS = 0;
			var tempTransfer = 0;
			var tempTotal = 0;

			resOrders.data.forEach((order) => {
				const orderTime = new Date(order.date);
				orderTime.setHours(0, 0, 0, 0);
				if (today.getTime() === orderTime.getTime()) {
					if (order.type === "Online") {
						order.items.forEach((item) => {
							const idx = tempOnline.findIndex(
								(i) => i.name === item.name
							);
							if (idx !== -1) {
								tempOnline[idx] = {
									...tempOnline[idx],
									quantity:
										tempOnline[idx].quantity +
										item.quantity,
								};
							}
						});
					} else {
						order.items.forEach((item) => {
							const idx = tempOffline.findIndex(
								(i) => i.name === item.name
							);
							if (idx !== -1) {
								tempTotal += item.quantity * item.price;
								if (order.payment === "Cash")
									tempCash += item.quantity * item.price;
								else if (order.payment === "QRIS")
									tempQRIS += item.quantity * item.price;
								else if (order.payment === "Transfer")
									tempTransfer += item.quantity * item.price;
								tempOffline[idx] = {
									...tempOffline[idx],
									quantity:
										tempOffline[idx].quantity +
										item.quantity,
									totalPrice:
										tempOffline[idx].totalPrice +
										item.quantity * item.price,
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
					<input
						type="date"
						name=""
						id=""
						onChange={(e) => {
							setDate(e.target.value);
						}}
						value={date}
						className="bg-(--bg-light) hover:bg-(--accent-light) transition-all ease-in p-2 w-fit rounded-sm cursor-pointer shadow-md"
					/>
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
									{offlineSales.map((item) => {
										if (item.quantity > 0) {
											return (
												<tr
													key={item.name}
													className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
												>
													<td className="border-l-1 border-(--bg-light) p-1">
														{item.name}
													</td>
													<td className="p-1">
														{item.quantity}
													</td>
													<td className="border-l-1 border-(--bg-light) p-1">
														{item.totalPrice}
													</td>
												</tr>
											);
										}
									})}
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-md p-1"
										>
											Total
										</td>
										<td className="border-l-1 p-1 border-(--bg-light) text-center rounded-br-md font-bold">
											{totalSale}
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
									{onlineSales.map((item) => {
										if (item.quantity > 0) {
											return (
												<tr
													key={item.name}
													className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
												>
													<td className="border-l-1 border-(--bg-light) p-1">
														{item.name}
													</td>
													<td className="p-1">
														{item.quantity}
													</td>
												</tr>
											);
										}
									})}
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-md p-1 rounded-br-md"
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
										<td className="border-l-1 border-(--bg-light) p-1">
											Cash
										</td>
										<td className="p-1">{totalCash}</td>
									</tr>
									<tr className="border-t-1 border-(--bg-light) bg-(--bg) text-center">
										<td className="border-l-1 border-(--bg-light) p-1">
											QRIS
										</td>
										<td className="p-1">{totalQRIS}</td>
									</tr>
									<tr className="border-t-1 border-(--bg-light) bg-(--bg) text-center">
										<td className="border-l-1 border-(--bg-light) p-1">
											Transfer
										</td>
										<td className="p-1">{totalTransfer}</td>
									</tr>
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td className="border-l-1 border-(--bg-light) p-1 text-center font-bold">
											Total
										</td>
										<td className="p-1 text-center font-bold">
											{totalSale}
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

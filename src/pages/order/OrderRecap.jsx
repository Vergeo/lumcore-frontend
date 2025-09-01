import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

const OrderRecap = () => {
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const [items, setItems] = useState([]);
	const [sales, setSales] = useState([]);
	const [totalSale, setTotalSale] = useState(0);
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	const getItems = async () => {
		try {
			const res = await axiosPrivate.get(`/items`);
			setItems(
				res.data.map((item) => {
					return { name: item.name, quantity: 0, totalPrice: 0 };
				})
			);
		} catch (err) {
			console.log(err);
			navigate("/");
		}
	};

	const getSales = async () => {
		try {
			const res = await axiosPrivate.get(`/sales`);

			var data = items.slice();
			const date1 = new Date(date);

			date1.setHours(0, 0, 0, 0);
			var total = 0;

			res.data.forEach((sale) => {
				const date2 = new Date(sale.date);
				date2.setHours(0, 0, 0, 0);
				if (date1.getTime() === date2.getTime()) {
					sale.items.forEach((item) => {
						data = data.map((item2) => {
							if (item.name === item2.name) {
								total += item.price * item.quantity;
								return {
									...item2,
									quantity: item2.quantity + item.quantity,
									totalPrice:
										item2.totalPrice +
										item.price * item.quantity,
								};
							}
							return item2;
						});
					});
				}
			});
			setTotalSale(total);
			setSales(data);
		} catch (err) {
			console.log(err);
			navigate("/");
		}
	};

	useEffect(() => {
		getItems();
	}, []);

	useEffect(() => {
		getSales();
		// console.log(items);
	}, [items, date]);

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3 pr-6 flex flex-col gap-1 items-center">
				<div className="text-2xl text-left text-(--dark-mint) font-bold">
					Rekap Pesanan
				</div>
				<input
					type="date"
					name=""
					id=""
					onChange={(e) => {
						setDate(e.target.value);
					}}
					value={date}
					className="bg-(--light-mint) hover:bg-(--mint) transition-all ease-in p-2 w-fit rounded-sm cursor-pointer"
				/>
				<table className="w-4/5">
					<thead className="bg-(--light-mint)">
						<tr>
							<th className="p-1 rounded-tl-sm">Item</th>
							<th className="p-1 border-l-2 border-(--white)">
								Banyak
							</th>
							<th className="p-1 border-l-2 border-(--white) rounded-tr-sm">
								Harga
							</th>
						</tr>
					</thead>
					<tbody>
						{sales?.map((item) => {
							if (item.quantity > 0) {
								return (
									<tr key={item.name}>
										<td className="p-1 border-t-2 border-(--white) bg-gray-200 text-center">
											{item.name}
										</td>
										<td className="p-1 border-l-2 border-t-2 border-(--white) bg-gray-200 text-center">
											{item.quantity}
										</td>
										<td className="p-1 border-l-2 border-t-2 border-(--white) bg-gray-200 text-center">
											{item.totalPrice}
										</td>
									</tr>
								);
							}
						})}
					</tbody>

					<tfoot>
						<tr>
							<td
								colSpan={2}
								className="bg-gray-300 rounded-bl-sm border-t-2 border-(--white) text-center font-bold"
							>
								Total
							</td>
							<td className="bg-gray-300 rounded-bl-sm border-l-2 border-t-2 border-(--white) text-center rounded-br-md font-bold">
								{totalSale}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
};

export default OrderRecap;

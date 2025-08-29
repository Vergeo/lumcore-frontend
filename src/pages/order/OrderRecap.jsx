import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { apiRoot } from "../../config/apiRoot";

const OrderRecap = () => {
	const [items, setItems] = useState([]);
	const [sales, setSales] = useState([]);
	const [totalSale, setTotalSale] = useState(0);
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	const getItems = async () => {
		try {
			const res = await axios.get(`${apiRoot}items/`);
			setItems(
				res.data.map((item) => {
					return { name: item.name, quantity: 0, totalPrice: 0 };
				})
			);
		} catch (err) {
			console.log(err);
		}
	};

	const getSales = async () => {
		const res = await axios.get(`${apiRoot}sales/`);

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
	};

	useEffect(() => {
		getItems();
	}, []);

	useEffect(() => {
		getSales();
		console.log(items);
	}, [items, date]);

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3 flex flex-col gap-1">
				<input
					type="date"
					name=""
					id=""
					onChange={(e) => {
						setDate(e.target.value);
					}}
					value={date}
				/>
				<table>
					<thead>
						<tr>
							<th>Item</th>
							<th>Quantity</th>
							<th>Price</th>
						</tr>
					</thead>
					<tbody>
						{sales?.map((item) => {
							if (item.quantity > 0) {
								return (
									<tr key={item.name}>
										<td>{item.name}</td>
										<td>{item.quantity}</td>
										<td>{item.totalPrice}</td>
									</tr>
								);
							}
						})}
					</tbody>
				</table>
				{totalSale}
			</div>
		</div>
	);
};

export default OrderRecap;

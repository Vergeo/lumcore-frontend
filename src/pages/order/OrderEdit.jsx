import axios from "axios";
import React, { act, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { apiRoot } from "../../config/apiRoot";

const OrderEdit = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [items, setItems] = useState({});
	const [categories, setCategories] = useState([]);
	const [activeCategory, setActiveCategory] = useState("");

	const [tempOrder, setTempOrder] = useState([]);
	const [order, setOrder] = useState([]);
	const [sale, setSale] = useState({});

	const [number, setNumber] = useState(0);
	const [tableNumber, setTableNumber] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);

	const getSale = async () => {
		try {
			const res = await axios.get(`${apiRoot}sales/${params.saleId}`);
			setNumber(res.data.number);
			setTableNumber(res.data.tableNumber);
			setSale(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getItems = async () => {
		try {
			const res = await axios.get(`${apiRoot}items/`);
			// console.log(res.data);

			setTempOrder(
				res.data.map((item) => {
					return {
						...item,
						quantity: 0,
					};
				})
			);

			var result = {};
			var temp = [];

			res.data.forEach((item) => {
				var found = false;
				for (var cat in result) {
					if (item.category == cat) {
						found = true;
						break;
					}
				}

				if (!found) {
					temp.push(item.category);
					result[item.category] = [];
				}
			});

			res.data.forEach((item) => {
				result[item.category].push({
					name: item.name,
					price: item.price,
				});
			});
			setItems(result);
			setCategories(temp);
			setActiveCategory(temp[0]);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (Object.keys(sale).length > 0 && tempOrder.length > 0) {
			setOrder(
				tempOrder.map((item) => {
					var qty = 0;
					sale.items.forEach((item2) => {
						if (item.name == item2.name) {
							qty = item2.quantity;
						}
					});
					return {
						...item,
						quantity: qty,
					};
				})
			);
		}
	}, [tempOrder, sale]);

	const addOrder = (itemToAdd) => {
		setOrder(
			order.map((item) =>
				item.name === itemToAdd
					? { ...item, quantity: item.quantity + 1 }
					: item
			)
		);
	};

	const removeOrder = (itemToRemove) => {
		setOrder(
			order.map((item) =>
				item.name === itemToRemove && item.quantity > 0
					? { ...item, quantity: item.quantity - 1 }
					: item
			)
		);
	};

	const saveOrder = async () => {
		try {
			var orderedItem = [];

			order.forEach((item) => {
				if (item.quantity > 0) {
					orderedItem.push({
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					});
				}
			});

			const newOrder = {
				id: sale._id,
				number,
				tableNumber,
				items: orderedItem,
				cashierId: sale.cashierId,
				status: sale.status,
				date: sale.date,
			};

			const res = await axios.patch(`${apiRoot}sales/`, newOrder);
			navigate("/orders");
		} catch (err) {
			console.log(err);
		}
	};

	const finishOrder = async () => {
		try {
			var orderedItem = [];

			order.forEach((item) => {
				if (item.quantity > 0) {
					orderedItem.push({
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					});
				}
			});

			const newOrder = {
				id: sale._id,
				number: sale.number,
				tableNumber: sale.tableNumber,
				items: orderedItem,
				cashierId: sale.cashierId,
				status: "finished",
				date: sale.date,
			};

			const res = await axios.patch(`${apiRoot}sales/`, newOrder);
			navigate("/orders");
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getItems();
		getSale();
	}, []);

	useEffect(() => {
		var total = 0;
		order.forEach((item) => {
			if (item.quantity > 0) {
				total += item.price * item.quantity;
			}
		});
		setTotalPrice(total);
	}, [order]);

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full flex py-6 px-3 bg-(--white)">
				<div className="flex flex-col bg-(--white) w-2/3">
					<div className="text-2xl font-bold text-(--dark-mint)">
						Edit Pesanan
					</div>
					<div className="flex bg-(--dark-mint) p-2 gap-2 wrap rounded-sm">
						{categories.map((category) => {
							return (
								<div
									key={category}
									className="px-3 py-1 bg-(--light-mint) cursor-pointer hover:bg-(--mint) rounded-sm transition-all ease-in"
								>
									<p
										onClick={() => {
											setActiveCategory(category);
										}}
									>
										{category}
									</p>
								</div>
							);
						})}
					</div>
					<div className="flex gap-3 flex-wrap mt-3 justify-">
						{items[activeCategory]?.map((item) => {
							return (
								<div
									key={item.name}
									className="w-40 h-min-20 bg-(--mint) flex flex-col gap-2 items-center p-3 text-(--white) text-center rounded-sm"
								>
									{item.name}
									<div className="flex gap-2">
										<div
											className="w-10 text-2xl h-7 rounded-sm bg-green-200 flex items-center justify-center text-(--dark-mint) cursor-pointer hover:bg-green-400 transition-all ease-in"
											onClick={() => {
												addOrder(item.name);
											}}
										>
											+
										</div>
										<div>{order[item.name]?.quantity}</div>
										<div
											className="w-10 text-2xl h-7 rounded-sm bg-red-200  flex items-center justify-center text-(--dark-mint) cursor-pointer hover:bg-red-400 transition-all ease-in"
											onClick={() => {
												removeOrder(item.name);
											}}
										>
											-
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="flex flex-col bg-(--light-mint) w-1/3 ml-3 p-2 gap-2 rounded-sm shadow-md">
					<div>
						<label htmlFor="number">No. Nota </label>
						<input
							type="text"
							name=""
							id="number"
							onChange={(e) => {
								setNumber(e.target.value);
							}}
							value={number}
							className="px-2 pt-1 bg-gray-200 outline-none border-b-4 border-gray-200 focus:border-[var(--dark-mint)] transition-all ease-in  rounded-sm"
							autoComplete="off"
						/>
					</div>
					<div>
						<label htmlFor="tableNumber">No. Meja </label>
						<input
							type="text"
							name=""
							id="tableNumber"
							onChange={(e) => {
								setTableNumber(e.target.value);
							}}
							value={tableNumber}
							className="px-2 pt-1 bg-gray-200 outline-none border-b-4 border-gray-200 focus:border-[var(--dark-mint)] transition-all ease-in  rounded-sm"
							autoComplete="off"
						/>
					</div>
					<table>
						<thead className="bg-(--mint) text-(--white)">
							<tr>
								<th className="text-center rounded-tl-sm">
									Qty
								</th>
								<th className="text-center border-l-2 border-(--light-mint)">
									Item
								</th>
								<th className="text-center rounded-tr-sm border-l-2 border-(--light-mint)">
									Price
								</th>
							</tr>
						</thead>
						<tbody>
							{order?.map((item) => {
								if (item.quantity > 0) {
									return (
										<tr key={item.name}>
											<td className="border-t-2 border-(--light-mint) bg-gray-200 text-center">
												{item.quantity}
											</td>
											<td className="border-t-2 border-l-2 border-(--light-mint) bg-gray-200 text-center">
												{item.name}
											</td>
											<td className="border-t-2 border-l-2 border-(--light-mint) bg-gray-200 text-center">
												{item.price * item.quantity}
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
									className="bg-gray-300 rounded-bl-sm border-t-2 border-(--light-mint) text-center font-bold"
								>
									Total
								</td>
								<td className="bg-gray-300 rounded-bl-sm border-t-2 border-l-2 border-(--light-mint) text-center rounded-br-md font-bold">
									{totalPrice}
								</td>
							</tr>
						</tfoot>
					</table>

					<div className="flex gap-2">
						<div
							className="w-fit bg-(--mint) text-(--white) px-3 py-1 cursor-pointer hover:bg-(--dark-mint) rounded-sm transition-all ease-in"
							onClick={() => {
								saveOrder();
							}}
						>
							Simpan
						</div>

						<div
							className="w-fit bg-(--white) px-3 py-1 cursor-pointer hover:bg-gray-200 rounded-sm transition-all ease-in"
							onClick={() => {
								finishOrder();
							}}
						>
							Selesai
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderEdit;

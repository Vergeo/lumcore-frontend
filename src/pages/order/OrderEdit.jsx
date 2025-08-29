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

			console.log(newOrder);

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

			console.log(newOrder);

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

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full flex py-6 px-3 bg-(--white)">
				<div className="flex flex-col bg-(--white) w-2/3">
					<div className="flex bg-(--dark-mint) p-2 gap-2 wrap">
						{categories.map((category) => {
							return (
								<div
									key={category}
									className="px-3 py-1 bg-(--light-mint) cursor-pointer hover:bg-(--mint)"
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
					<div className="flex gap-3 flex-wrap mt-3">
						{items[activeCategory]?.map((item) => {
							return (
								<div
									key={item.name}
									className="w-40 h-min-20 bg-(--mint) flex flex-col gap-2 items-center p-3 text-(--white) text-center"
								>
									{item.name}
									<div className="flex gap-2">
										<div
											className="w-5 h-5 bg-green-200 flex items-center justify-center text-(--dark-mint) cursor-pointer hover:bg-green-400"
											onClick={() => {
												addOrder(item.name);
											}}
										>
											+
										</div>
										<div>{order[item.name]?.quantity}</div>
										<div
											className="w-5 h-5 bg-red-200  flex items-center justify-center text-(--dark-mint) cursor-pointer hover:bg-red-400"
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
				<div className="flex flex-col bg-(--light-mint) w-1/3 ml-3 p-2 gap-2">
					<div>Nomor Nota: {number}</div>
					<div>
						<label htmlFor="tableNumber">Nomor Meja: </label>
						<input
							type="text"
							name=""
							id="tableNumber"
							onChange={(e) => {
								setTableNumber(e.target.value);
							}}
							value={tableNumber}
							className="bg-(--mint)"
							autoComplete="off"
						/>
					</div>
					<table>
						<thead>
							<tr>
								<th className="border-black border-2 text-center">
									Qty
								</th>
								<th className="border-black border-2 text-center">
									Item
								</th>
								<th className="border-black border-2 text-center">
									Price
								</th>
							</tr>
						</thead>
						<tbody>
							{order?.map((item) => {
								if (item.quantity > 0) {
									return (
										<tr key={item.name}>
											<td className="border-black border-2 text-center">
												{item.quantity}
											</td>
											<td className="border-black border-2 text-center">
												{item.name}
											</td>
											<td className="border-black border-2 text-center">
												{item.price * item.quantity}
											</td>
										</tr>
									);
								}
							})}
						</tbody>
					</table>

					<div
						className="px-3 py-1 bg-(--mint) text-(--white) w-fit cursor-pointer hover:bg-(--dark-mint)"
						onClick={() => {
							saveOrder();
						}}
					>
						Save
					</div>
					<div
						className="px-3 py-1 bg-(--mint) text-(--white) w-fit cursor-pointer hover:bg-(--dark-mint)"
						onClick={() => {
							finishOrder();
						}}
					>
						Finish
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderEdit;

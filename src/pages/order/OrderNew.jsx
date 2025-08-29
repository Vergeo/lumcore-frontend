import axios from "axios";
import React, { act, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const OrderNew = () => {
	const navigate = useNavigate();
	const [items, setItems] = useState({});
	const [categories, setCategories] = useState([]);
	const [activeCategory, setActiveCategory] = useState("");
	const [number, setNumber] = useState(0);
	const [tableNumber, setTableNumber] = useState(0);

	const [order, setOrder] = useState([]);

	const getNumber = async () => {
		const res = await axios.get("http://localhost:3500/sales/");

		var maximumNumber = 0;
		res.data.forEach((sale) => {
			maximumNumber = Math.max(maximumNumber, sale.number);
		});
		setNumber(maximumNumber + 1);
	};

	const getItems = async () => {
		try {
			const res = await axios.get("http://localhost:3500/items/");
			// console.log(res.data);

			setOrder(
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
				number,
				tableNumber,
				items: orderedItem,
				cashierId: "68a7219623252e59558eb86f",
				status: "active",
				date: new Date(),
			};

			console.log(newOrder);

			const res = await axios.post(
				"http://localhost:3500/sales/",
				newOrder
			);
			console.log(res);
			navigate("/orders");
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getItems();
		getNumber();
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
					<div>
						<label htmlFor="number">Nomor Nota: </label>
						<input
							type="text"
							name=""
							id="number"
							onChange={(e) => {
								setNumber(e.target.value);
							}}
							value={number}
							className="bg-(--mint)"
							autoComplete="off"
						/>
					</div>
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
				</div>
			</div>
		</div>
	);
};

export default OrderNew;

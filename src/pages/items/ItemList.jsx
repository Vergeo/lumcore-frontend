import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { style } from "../../styles/style";

const ItemList = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [items, setItems] = useState([]);
	const [maxIndex, setMaxIndex] = useState(0);

	const [switch1, setSwitch1] = useState();
	const [switch2, setSwitch2] = useState();

	const fetchItems = async () => {
		try {
			const res = await axiosPrivate.get("items");

			var tempMax = 0;

			res.data.forEach((item) => {
				if (item.index && item.index > tempMax) {
					tempMax = item.index;
				}
			});
			setMaxIndex(tempMax);
			res.data.sort(function (a, b) {
				return a.index - b.index;
			});
			setItems(res.data);
		} catch (error) {
			if (error.code === 403) {
				navigate("/");
			}
		}
	};
	useEffect(() => {
		fetchItems();
	}, []);

	const switchIndex = async (id1, id2) => {
		try {
			console.log("switching");
			const [resItem1, resItem2] = await Promise.all([
				axiosPrivate.get(`/items/${id1}`),
				axiosPrivate.get(`/items/${id2}`),
			]);

			const editedItem1 = {
				id: resItem1.data._id,
				index: resItem2.data.index,
				name: resItem1.data.name,
				price: resItem1.data.price,
				category: resItem1.data.category,
			};

			const editedItem2 = {
				id: resItem2.data._id,
				index: resItem1.data.index,
				name: resItem2.data.name,
				price: resItem2.data.price,
				category: resItem2.data.category,
			};
			await axiosPrivate.patch("/items", editedItem1);
			await axiosPrivate.patch("/items", editedItem2);
			setSwitch1();
			setSwitch2();
			fetchItems();
		} catch (error) {
			setSwitch1();
			setSwitch2();
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	const handleSwitch = (id) => {
		if (!switch1) setSwitch1(id);
		else if (!switch2) setSwitch2(id);
	};

	useEffect(() => {
		if (switch2) switchIndex(switch1, switch2);
	}, [switch2]);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col p-6 gap-6">
				<div className="flex justify-between">
					<h1 className={style.h1}>Daftar Item Menu</h1>
					<button
						className={style.button}
						onClick={() => {
							navigate(`/items/new/${maxIndex + 1}`);
						}}
					>
						Item Baru
					</button>
				</div>
				<div
					className={
						style.card +
						"w-full p-6 bg-(--bg-light) items-start gap-2"
					}
				>
					<table className="w-full">
						<thead>
							<tr className="bg-(--bg-dark) text-(--text)">
								<th className="rounded-tl-sm p-1">Index</th>
								<th className="border-l-1 border-(--bg-light) rounded-tl-sm p-1">
									Nama
								</th>
								<th className="border-l-1 border-(--bg-light) p-1">
									Harga
								</th>
								<th className="border-l-1 border-(--bg-light) p-1">
									Kategori
								</th>
								<th
									colSpan={2}
									className="border-l-1 border-(--bg-light) rounded-tr-sm p-1"
								>
									Edit
								</th>
							</tr>
						</thead>
						<tbody>
							{items.map((item) => {
								return (
									<tr
										key={item.name}
										className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
									>
										<td className="p-1">{item.index}</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{item.name}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{item.price}
										</td>
										<td className="border-l-1 border-(--bg-light) p-1">
											{item.category}
										</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												navigate(
													`/items/edit/${item._id}`
												);
											}}
										>
											<i className="fa-solid fa-pen-to-square"></i>
										</td>
										<td
											className="border-l-1 border-(--bg-light) p-1 hover:bg-(--accent-light) cursor-pointer transition-all ease-in"
											onClick={() => {
												handleSwitch(item._id);
											}}
										>
											{switch1 === item._id ||
											switch2 === item._id ? (
												<i className="fa-solid fa-cog fa-spin"></i>
											) : (
												<i className="fa-solid fa-shuffle"></i>
											)}
										</td>
									</tr>
								);
							})}
							<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
								<td
									colSpan={6}
									className="text-center font-bold rounded-bl-sm rounded-br-sm rounded- p-1"
								></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ItemList;

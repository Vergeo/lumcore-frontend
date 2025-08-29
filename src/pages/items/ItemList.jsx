import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiRoot } from "../../config/apiRoot";

const ItemList = () => {
	const [items, setItems] = useState([]);
	const [counter, setCounter] = useState(0);

	const navigate = useNavigate();

	const fetchItems = async () => {
		try {
			const res = await axios.get(`${apiRoot}items/`);
			setItems(res.data);
			console.log(items);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3 flex flex-col items-center gap-1">
				<h1 className="text-lg">Item List</h1>
				<div
					className="bg-(--light-mint) px-3 py-1 cursor-pointer hover:bg-(--mint)"
					onClick={() => {
						navigate("/items/new");
					}}
				>
					Add Item
				</div>
				<table className="w-4/5 bg-white">
					<thead>
						<tr>
							<th className="bg-(--light-mint) border-b-2 border-gray-100 p-1">
								Name
							</th>
							<th className="bg-(--light-mint) border-b-2 border-gray-100 p-1">
								Category
							</th>
							<th className="bg-(--light-mint) border-b-2 border-gray-100 p-1">
								Price
							</th>
							<th className="bg-(--light-mint) border-b-2 border-gray-100 p-1">
								Edit
							</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => {
							return (
								<tr key={item._id}>
									<td className="border-b-2 border-gray-100 p-1">
										{item.name}
									</td>
									<td className="border-b-2 border-gray-100 p-1">
										{item.category}
									</td>
									<td className="border-b-2 border-gray-100 p-1">
										{item.price}
									</td>
									<td className="border-b-2 border-gray-100 p-1">
										<Link
											className="cursor-pointer"
											to={`/items/edit/${item._id}`}
										>
											Edit
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ItemList;

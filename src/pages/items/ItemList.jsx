import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ItemList = () => {
	const [items, setItems] = useState([]);
	const [counter, setCounter] = useState(0);

	const axiosPrivate = useAxiosPrivate();

	const navigate = useNavigate();

	const fetchItems = async () => {
		try {
			const res = await axiosPrivate.get(`/items`);
			setItems(res.data);
		} catch (err) {
			console.log(err);
			navigate("/");
		}
	};
	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3 flex flex-col items-center gap-1">
				<div className="text-2xl text-left text-(--dark-mint) font-bold">
					Item List
				</div>
				<div
					className="bg-(--light-mint) px-3 py-1 cursor-pointer hover:bg-(--mint) rounded-sm transition-all ease-in"
					onClick={() => {
						navigate("/items/new");
					}}
				>
					Add Item
				</div>
				<table className="w-4/5 bg-white">
					<thead>
						<tr>
							<th className="bg-(--light-mint) border-white p-1 rounded-tl-sm">
								Name
							</th>
							<th className="bg-(--light-mint) border-l-2 border-white p-1">
								Category
							</th>
							<th className="bg-(--light-mint) border-l-2 border-white p-1">
								Price
							</th>
							<th className="bg-(--light-mint) border-l-2 border-white p-1 rounded-tr-sm">
								Edit
							</th>
						</tr>
					</thead>
					<tbody>
						{items.map((item) => {
							return (
								<tr key={item._id}>
									<td className="border-t-2 border-white p-1 bg-gray-200 text-center">
										{item.name}
									</td>
									<td className="border-t-2 border-l-2 border-white p-1 bg-gray-200 text-center">
										{item.category}
									</td>
									<td className="border-t-2 border-l-2 border-white p-1 bg-gray-200 text-center">
										{item.price}
									</td>
									<td className="border-t-2 border-l-2 border-white p-1 bg-gray-200 text-center">
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
					<tfoot>
						<tr>
							<td
								colSpan={4}
								className="border-t-2 border-white bg-gray-300 text-gray-300 rounded-b-sm"
							>
								-
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
};

export default ItemList;

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ItemEdit = () => {
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState(0);

	const navigate = useNavigate();
	const params = useParams();

	const saveItem = async () => {
		try {
			const editedItem = {
				id: params.itemId,
				name,
				category,
				price,
			};

			console.log(editedItem);

			const res = await axios.patch(
				"http://localhost:3500/items/",
				editedItem
			);

			navigate("/items");
			console.log(res);
		} catch (err) {
			console.log(err);
		}
	};

	const deleteItem = async () => {
		try {
			const deletedItem = {
				id: params.itemId,
				name,
				category,
				price,
			};
			console.log(deletedItem);
			// const res = await axios.delete("http://localhost:3500/items/", {
			// 	params: { id: params.itemId },
			// });

			const res = await axios({
				method: "DELETE",
				url: "http://localhost:3500/items/",
				data: { id: params.itemId },
			});

			console.log(res);
			navigate("/items");
		} catch (err) {
			console.log(err);
		}
	};

	const getItem = async () => {
		try {
			const res = await axios.get(
				`http://localhost:3500/items/${params.itemId}`
			);
			setName(res.data.name);
			setCategory(res.data.category);
			setPrice(res.data.price);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		getItem();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3 flex flex-col gap-1">
				<h1 className="text-2xl font-bold text-(--dark-mint)">
					Edit Item
				</h1>
				<form
					className="flex flex-col gap-1"
					onSubmit={(e) => {
						e.preventDefault();
						saveItem();
					}}
				>
					<div className="flex">
						<label htmlFor="name" className="w-20">
							Name
						</label>
						<input
							type="text"
							id="name"
							autoComplete="off"
							onChange={(e) => {
								setName(e.target.value);
							}}
							value={name}
							className="bg-gray-200"
						></input>
					</div>
					<div className="flex">
						<label htmlFor="category" className="w-20">
							Category
						</label>
						<input
							type="text"
							id="category"
							autoComplete="off"
							onChange={(e) => {
								setCategory(e.target.value);
							}}
							value={category}
							className="bg-gray-200"
						></input>
					</div>
					<div className="flex">
						<label htmlFor="price" className="w-20">
							Price
						</label>
						<input
							type="number"
							id="price"
							autoComplete="off"
							onChange={(e) => {
								setPrice(e.target.value);
							}}
							value={price}
							className="bg-gray-200"
						></input>
					</div>
					<div className="flex gap-1">
						<div
							className="px-3 py-1 cursor-pointer bg-red-200 hover:bg-red-400 transition-all ease-in"
							onClick={() => {
								navigate("/items");
							}}
						>
							Cancel
						</div>
						<input
							type="submit"
							value="Save"
							className="px-3 py-1 cursor-pointer bg-(--light-mint) hover:bg-(--mint) transition-all ease-in"
						/>
						<div
							className="px-3 py-1 cursor-pointer bg-red-200 hover:bg-red-400 transition-all ease-in"
							onClick={(e) => {
								e.preventDefault();
								deleteItem();
							}}
						>
							Delete
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ItemEdit;

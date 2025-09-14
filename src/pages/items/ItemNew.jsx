import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ItemNew = () => {
	const axiosPrivate = useAxiosPrivate();
	const [name, setName] = useState("");
	const [category, setCategory] = useState("");
	const [price, setPrice] = useState(0);

	const navigate = useNavigate();
	const params = useParams();

	const addItem = async () => {
		try {
			const newItem = {
				index: params.index,
				name,
				category,
				price,
			};
			const res = await axiosPrivate.post(`/items`, newItem);
			navigate("/items");
		} catch (err) {
			console.log(err);
			navigate("/");
		}
	};

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3 flex flex-col gap-1">
				<h1 className="text-2xl font-bold text-(--dark-mint)">
					Create New Item
				</h1>
				<form
					className="flex flex-col gap-1"
					onSubmit={(e) => {
						e.preventDefault();
						addItem();
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
							value="Create"
							className="px-3 py-1 cursor-pointer bg-(--light-mint) hover:bg-(--mint) transition-all ease-in"
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ItemNew;

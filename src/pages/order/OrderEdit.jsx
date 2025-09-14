import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

const orderEdit = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const { auth } = useAuth();

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isFinishing, setIsFinishing] = useState(false);
	const [menuItems, setMenuItems] = useState([]);
	const [categories, setCategories] = useState([]);

	const [currentCategory, setCurrentCategory] = useState({});
	const [totalPrice, setTotalPrice] = useState(0);

	const [paymentMehods, setPaymentMethods] = useState([
		"Cash",
		"QRIS",
		"Transfer",
	]);
	const [types, setTypes] = useState({
		Offline: ["1", "2", "3", "4", "5", "6", "7", "8", "Bungkus"],
		Online: ["Gojek", "Grab", "Shopee"],
	});
	const [id, setId] = useState();
	const [number, setNumber] = useState(0);
	const [selectedMethod, setSelectedMethod] = useState("");
	const [selectedType, setSelectedType] = useState("Offline");
	const [tableNumber, setTableNumber] = useState("");

	const [errorMessage, setErrorMessage] = useState("");

	const getMenuItems = async () => {
		try {
			setIsLoading(true);

			const [resCategory, resItems, resOrder] = await Promise.all([
				axiosPrivate.get("categories"),
				axiosPrivate.get("items"),
				axiosPrivate.get(`/sales/${params.saleId}`),
			]);

			resItems.data.sort(function (a, b) {
				return a.index - b.index;
			});

			setId(resOrder.data._id);
			setNumber(resOrder.data.number);
			setTableNumber(resOrder.data.tableNumber);
			setSelectedType(resOrder.data.type);
			setSelectedMethod(resOrder.data.payment);

			setCategories(
				resCategory.data.map((category) => {
					const itemCount = resItems.data.filter(
						(item) => item.category === category.name
					).length;

					return { ...category, quantity: itemCount };
				})
			);

			setMenuItems(
				resItems.data.map((item) => {
					const orderedItem = resOrder.data.items.find(
						(ordered) => ordered.name === item.name
					);

					return {
						name: item.name,
						category: item.category,
						price: item.price,
						quantity: orderedItem ? orderedItem.quantity : 0,
					};
				})
			);

			setCurrentCategory(resCategory.data[0]);

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		getMenuItems();
	}, []);

	const addOrder = (itemToAdd, quantity) => {
		setMenuItems(
			menuItems.map((item) =>
				item.name === itemToAdd && item.quantity + quantity >= 0
					? { ...item, quantity: item.quantity + quantity }
					: item
			)
		);
	};

	useEffect(() => {
		var total = 0;
		menuItems.forEach((item) => {
			total += item.quantity * item.price;
		});
		setTotalPrice(total);
	}, [menuItems]);

	const saveOrder = async () => {
		try {
			setErrorMessage("");
			setIsSaving(true);
			var orderedItem = [];

			menuItems.forEach((item) => {
				if (item.quantity > 0) {
					orderedItem.push({
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					});
				}
			});

			const orderObject = {
				id,
				number,
				tableNumber,
				cashier: auth.username,
				status: "active",
				type: selectedType,
				payment: selectedMethod,
				items: orderedItem,
				date: new Date(),
			};

			const res = await axiosPrivate.patch("sales", orderObject);
			setIsSaving(false);
			navigate("/orders");
		} catch (error) {
			setErrorMessage(error.response.data.message);
			setIsSaving(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	const finishOrder = async () => {
		try {
			setErrorMessage("");
			setIsFinishing(true);
			var orderedItem = [];

			menuItems.forEach((item) => {
				if (item.quantity > 0) {
					orderedItem.push({
						name: item.name,
						price: item.price,
						quantity: item.quantity,
					});
				}
			});

			const orderObject = {
				id,
				number,
				tableNumber,
				cashier: auth.username,
				status: "finished",
				type: selectedType,
				payment: selectedMethod,
				items: orderedItem,
				date: new Date(),
			};

			const res = await axiosPrivate.patch("sales", orderObject);
			setIsFinishing(false);
			navigate("/orders");
		} catch (error) {
			setErrorMessage(error.response.data.message);
			setIsFinishing(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex p-6 gap-6">
				<div className="w-2/3 gap-5 flex flex-col">
					<h1 className={style.h1}>Edit Pesanan</h1>

					{isLoading && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Menu
						</div>
					)}
					{!isLoading && (
						<div className="w-full flex flex-col gap-6">
							<div className="w-full mb-2 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-3">
								{categories.map((category) => {
									return currentCategory.name ===
										category.name ? (
										<div
											key={category.name}
											className="flex p-2 gap-2 grow bg-(--accent) text-(--bg-light) shadow-sm rounded-sm transition-all ease-in"
										>
											<div className="transition-all ease-in h-full aspect-square flex justify-center items-center bg-(--bg) rounded-sm">
												<i
													className={
														"text-(--accent) transition-all ease-in fa-solid " +
														category.icon
													}
												></i>
											</div>
											<div>
												<div className="font-bold">
													{category.name}
												</div>
												<div
													className={
														"text-sm text-(--bg-dark)"
													}
												>
													{category.quantity} Barang
												</div>
											</div>
										</div>
									) : (
										<div
											key={category.name}
											className="group flex p-2 gap-2 grow bg-(--bg-light) shadow-sm rounded-sm cursor-pointer hover:bg-(--accent-light) transition-all ease-in"
											onClick={() => {
												setCurrentCategory(category);
											}}
										>
											<div className="group-hover:bg-(--bg-dark) transition-all ease-in h-full aspect-square flex justify-center items-center bg-(--bg) rounded-sm">
												<i
													className={
														"group-hover:text-(--accent) transition-all ease-in fa-solid " +
														category.icon
													}
												></i>
											</div>
											<div>
												<div className="font-bold">
													{category.name}
												</div>
												<div
													className={
														style.p_muted +
														"text-sm"
													}
												>
													{category.quantity} Barang
												</div>
											</div>
										</div>
									);
								})}
							</div>
							<div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-3">
								{menuItems.map((item) => {
									if (
										item.category === currentCategory.name
									) {
										return (
											<div
												key={item.name}
												className={
													style.card +
													"bg-(--bg-light) p-2 flex-row justify-start gap-2"
												}
											>
												<div className="h-full aspect-square bg-(--bg) flex justify-center items-center">
													<i
														className={
															"fa-2xl fa-solid " +
															currentCategory.icon
														}
													></i>
												</div>
												<div>
													<div className="text-lg text">
														{item.name}
													</div>
													<div className="w-fit flex justify-center gap-3 items-center bg-(--bg) rounded-sm p-1">
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-md cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-4"
															onClick={() => {
																addOrder(
																	item.name,
																	-10
																);
															}}
														>
															<i class="fa-solid fa-minus"></i>
														</div>
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-xs cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-2"
															onClick={() => {
																addOrder(
																	item.name,
																	-1
																);
															}}
														>
															<i class="fa-solid fa-minus"></i>
														</div>
														<div className="text-lg">
															{item.quantity}
														</div>
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-xs cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-2"
															onClick={() => {
																addOrder(
																	item.name,
																	1
																);
															}}
														>
															<i class="fa-solid fa-plus"></i>
														</div>
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-md cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-4"
															onClick={() => {
																addOrder(
																	item.name,
																	10
																);
															}}
														>
															<i class="fa-solid fa-plus"></i>
														</div>
													</div>
												</div>
											</div>
										);
									}
								})}
							</div>
						</div>
					)}
				</div>
				<div
					className={
						"w-1/3 bg-(--bg-light) gap-2 justify-start p-3 items-start" +
						style.card
					}
				>
					<div className="w-full flex flex-col gap-2">
						{errorMessage && (
							<div className={style.error}>{errorMessage}</div>
						)}
						<h3 className={style.h3}>Informasi Pesanan</h3>
						<div className="flex gap-2 items-center">
							<label htmlFor="number">No. Nota</label>
							<input
								type="number"
								name=""
								id="number"
								onChange={(e) => {
									setNumber(e.target.value);
								}}
								value={number}
								autoComplete="off"
								className={style.text_input + "w-fit"}
							/>
						</div>
						<div className="flex gap-2 items-center">
							<label htmlFor="tableNumber">No. Meja</label>
							<input
								type="text"
								name=""
								id="tableNumber"
								onChange={(e) => {
									setTableNumber(e.target.value);
								}}
								value={tableNumber}
								autoComplete="off"
								className={style.text_input}
							/>
						</div>
					</div>
					<div className="w-full flex flex-col">
						<div className="grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-2">
							{Object.keys(types).map((type) => {
								return (
									<div key={type}>
										<label
											// htmlFor={num}
											className={
												selectedType === type
													? style.radio_checked
													: style.radio
											}
										>
											<input
												type="radio"
												name="type"
												value={type}
												className="hidden"
												checked={tableNumber === type}
												onChange={(e) =>
													setSelectedType(
														e.target.value
													)
												}
											/>
											{type}
										</label>
									</div>
								);
							})}
						</div>
					</div>
					<div className="w-full flex flex-col">
						<div className="grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-2">
							{types[selectedType].map((num) => {
								return (
									<div key={num}>
										<label
											// htmlFor={num}
											className={
												tableNumber === num
													? style.radio_checked
													: style.radio
											}
										>
											<input
												type="radio"
												name="tableNumber"
												value={num}
												className="hidden"
												checked={tableNumber === num}
												onChange={(e) =>
													setTableNumber(
														e.target.value
													)
												}
											/>
											{num}
										</label>
									</div>
								);
							})}
						</div>
					</div>
					<hr className="bg-(--bg) h-0.5 border-0 w-full rounded-lg"></hr>
					<div className="w-full flex flex-col gap-2">
						<h3 className={style.h3}>Pesanan</h3>
						<table className="w-full">
							<thead>
								<tr className="bg-(--bg-dark) text-(--text)">
									<th className="rounded-tl-sm p-1">
										Banyak
									</th>
									<th
										className={
											"border-l-1 border-(--bg-light) p-1" +
												selectedType !==
												"Online" && "rounded-tr-sm"
										}
									>
										Item
									</th>
									{selectedType !== "Online" && (
										<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
											Harga
										</th>
									)}
								</tr>
							</thead>
							<tbody>
								{menuItems.map((item) => {
									if (item.quantity > 0) {
										return (
											<tr
												key={item.name}
												className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
											>
												<td className="p-1">
													{item.quantity}
												</td>
												<td className="border-l-1 border-(--bg-light) p-1">
													{item.name}
												</td>
												{selectedType !== "Online" && (
													<td className="border-l-1 border-(--bg-light) p-1">
														{item.price *
															item.quantity}
													</td>
												)}
											</tr>
										);
									}
								})}
								{selectedType !== "Online" ? (
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-md p-1"
										>
											Total
										</td>
										<td className="border-l-1 p-1 border-(--bg-light) text-center rounded-br-md font-bold">
											{totalPrice}
										</td>
									</tr>
								) : (
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-md p-1 rounded-br-md"
										></td>
									</tr>
								)}
							</tbody>
						</table>
						<div
							className={
								!isSaving && !isFinishing
									? style.button + "w-fit"
									: style.button_muted + "w-fit"
							}
							onClick={() => {
								!isSaving && !isFinishing
									? saveOrder()
									: () => {};
							}}
						>
							{!isSaving ? (
								"Simpan Pesanan"
							) : (
								<div className="flex justify-center items-center">
									<i className="fa-solid fa-cog fa-spin mr-2"></i>
									Menyimpan Pesanan
								</div>
							)}
						</div>
					</div>

					<hr className="bg-(--bg) h-0.5 border-0 w-full rounded-lg"></hr>
					<div className="w-full flex flex-col gap-2">
						<h3 className={style.h3}>Pembayaran</h3>
						<div className="w-full mb-2 grid grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-3">
							{paymentMehods.map((method) => {
								return selectedMethod === method ? (
									<div
										key={method}
										className="flex p-2 gap-2 grow bg-(--accent) text-(--bg-light) shadow-sm rounded-sm transition-all ease-in justify-center"
									>
										{method}
									</div>
								) : (
									<div
										key={method}
										className="group flex p-2 gap-2 grow bg-(--bg) shadow-sm rounded-sm cursor-pointer hover:bg-(--accent-light) transition-all ease-in justify-center"
										onClick={() => {
											setSelectedMethod(method);
										}}
									>
										{method}
									</div>
								);
							})}
						</div>
					</div>
					<div
						className={
							!isSaving && !isFinishing
								? style.button
								: style.button_muted
						}
						onClick={() => {
							!isSaving && !isFinishing
								? finishOrder()
								: () => {};
						}}
					>
						{!isFinishing ? (
							"Selesaikan Pesanan"
						) : (
							<div className="flex justify-center items-center">
								<i className="fa-solid fa-cog fa-spin mr-2"></i>
								Menyelesaikan Pesanan
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default orderEdit;

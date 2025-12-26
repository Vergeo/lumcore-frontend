import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Navbar from "../../components/Navbar";
import { style } from "../../styles/style";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import NewOrder from "./NewOrder";

const NewEditOrder = () => {
	const navigate = useNavigate();
	const params = useParams();
	const axiosPrivate = useAxiosPrivate();

	const { auth } = useAuth();

	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isFinishing, setIsFinishing] = useState(false);

	const [menuCategories, setMenuCategories] = useState([]);
	const [selectedMenu, setSelectedMenu] = useState([]);
	const [currentCategory, setCurrentCategory] = useState({});

	const [totalPrice, setTotalPrice] = useState(0);

	const [paymentMehods, setPaymentMethods] = useState([
		"Cash",
		"QRIS",
		"Transfer",
	]);
	const [types, setTypes] = useState({
		Offline: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Bungkus"],
		Online: ["Gojek", "Grab", "Shopee"],
	});
	const [orderNumber, setOrderNumber] = useState(0);
	const [orderPaymentMethod, setOrderPaymentMethod] = useState("");
	const [orderType, setOrderType] = useState("Offline");
	const [orderTable, setOrderTable] = useState("");
	const [employeeId, setEmployeeId] = useState("");
	const [orderDate, setOrderDate] = useState("");

	const [errorMessage, setErrorMessage] = useState("");

	const fetchMenuData = async () => {
		try {
			setIsLoading(true);

			const [menuCategoryRes, menuRes, orderRes] = await Promise.all([
				axiosPrivate.get("menuCategory/getAllMenuCategories"),
				axiosPrivate.get("menu/getAllMenus"),
				axiosPrivate.get("order/getOrder/" + params.orderId),
			]);

			menuRes.data.sort(function (a, b) {
				return a.index - b.index;
			});

			setOrderNumber(orderRes.data.orderNumber);
			setOrderTable(orderRes.data.orderTable);
			setOrderType(orderRes.data.orderType);
			setOrderPaymentMethod(orderRes.data.orderPaymentMethod);
			setEmployeeId(orderRes.data.employeeId);
			setOrderDate(orderRes.data.orderDate);

			setMenuCategories(
				menuCategoryRes.data.map((menuCategory) => {
					const menuCount = menuRes.data.filter(
						(menu) => menu.menuCategoryId._id === menuCategory._id
					).length;

					return { ...menuCategory, quantity: menuCount };
				})
			);

			setSelectedMenu(
				menuRes.data.map((menu) => {
					const orderedMenu = orderRes.data.orderDetail.find(
						(ordered) => ordered.menuId._id === menu._id
					);
					return {
						menuId: menu._id,
						menuName: menu.menuName,
						menuCategoryName: menu.menuCategoryId?.menuCategoryName,
						menuPrice: menu.menuPrice,
						currentRecipeId: menu.currentRecipeId?._id,
						quantity: orderedMenu ? orderedMenu.quantity : 0,
					};
				})
			);

			setCurrentCategory(menuCategoryRes.data[0]);

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		fetchMenuData();
	}, []);

	const addOrder = (menuToAdd, quantity) => {
		setSelectedMenu((prev) =>
			prev.map((menu) =>
				menu.menuName === menuToAdd && menu.quantity + quantity >= 0
					? { ...menu, quantity: menu.quantity + quantity }
					: menu
			)
		);
	};

	useEffect(() => {
		var total = 0;
		selectedMenu.forEach((menu) => {
			total += menu.quantity * menu.menuPrice;
		});
		setTotalPrice(total);
	}, [selectedMenu]);

	const saveOrder = async () => {
		try {
			setErrorMessage("");
			setIsSaving(true);
			var orderDetail = [];

			selectedMenu.forEach((menu) => {
				if (menu.quantity > 0) {
					if (menu.currentRecipeId) {
						orderDetail.push({
							menuId: menu.menuId,
							menuPrice: menu.menuPrice,
							quantity: menu.quantity,
							recipeId: menu.currentRecipeId,
						});
					} else {
						orderDetail.push({
							menuId: menu.menuId,
							menuPrice: menu.menuPrice,
							quantity: menu.quantity,
						});
					}
				}
			});

			const updatedOrder = {
				id: params.orderId,
				orderNumber,
				orderDate,
				employeeId,
				orderType,
				orderTable,
				orderStatus: "active",
				orderDetail,
			};

			const res = await axiosPrivate.patch(
				"order/updateOrder",
				updatedOrder
			);
			setIsSaving(false);
			navigate("/order");
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
			var orderDetail = [];

			selectedMenu.forEach((menu) => {
				if (menu.quantity > 0) {
					if (menu.currentRecipeId) {
						orderDetail.push({
							menuId: menu.menuId,
							menuPrice: menu.menuPrice,
							quantity: menu.quantity,
							recipeId: menu.currentRecipeId,
						});
					} else {
						orderDetail.push({
							menuId: menu.menuId,
							menuPrice: menu.menuPrice,
							quantity: menu.quantity,
						});
					}
				}
			});

			const udpatedOrder = {
				id: params.orderId,
				orderNumber,
				orderDate,
				employeeId,
				orderType,
				orderTable,
				orderStatus: "finished",
				orderDetail,
				orderPaymentMethod,
			};

			const res = await axiosPrivate.patch(
				"order/updateOrder",
				udpatedOrder
			);

			orderDetail.map(async (menu) => {
				if (menu.recipeId) {
					const recipeRes = await axiosPrivate.get(
						"recipe/getRecipe/" + menu.recipeId
					);
					recipeRes.data.stockUsed.map(async (stock) => {
						const newStockMovement = {
							stockId: stock.stockId,
							stockQuantityChange:
								-stock.quantity * menu.quantity,
							movementDate: new Date(),
							movementType: "Order",
							orderId: params.orderId,
							employeeId: auth.userId,
						};

						const stockMovementRes = await axiosPrivate.post(
							"stockMovement/createStockMovement",
							newStockMovement
						);
					});
				}
			});

			setIsFinishing(false);
			navigate("/order");
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
					<h1 className={style.h1}>Buat Pesanan Baru</h1>

					{isLoading && (
						<div className="flex justify-start items-center">
							<i className="fa-solid fa-cog fa-spin mr-2"></i>
							Mengambil Data Menu
						</div>
					)}

					{!isLoading && (
						<div className="w-full flex flex-col gap-6">
							<div className="w-full mb-2 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-3">
								{menuCategories.map((menuCategory) => {
									return currentCategory.menuCategoryName ===
										menuCategory.menuCategoryName ? (
										<div
											key={menuCategory.menuCategoryName}
											className="flex p-2 gap-2 grow bg-(--accent) text-(--bg-light) shadow-sm rounded-sm transition-all ease-in"
										>
											<div className="transition-all ease-in h-full aspect-square flex justify-center items-center bg-(--bg) rounded-sm">
												<i
													className={
														"text-(--accent) transition-all ease-in fa-solid " +
														menuCategory.menuCategoryIcon
													}
												></i>
											</div>
											<div>
												<div className="font-bold">
													{
														menuCategory.menuCategoryName
													}
												</div>
												<div
													className={
														"text-sm text-(--bg-dark)"
													}
												>
													{menuCategory.quantity}{" "}
													Barang
												</div>
											</div>
										</div>
									) : (
										<div
											key={menuCategory.menuCategoryName}
											className="group flex p-2 gap-2 grow bg-(--bg-light) shadow-sm rounded-sm cursor-pointer hover:bg-(--accent-light) transition-all ease-in"
											onClick={() => {
												setCurrentCategory(
													menuCategory
												);
											}}
										>
											<div className="group-hover:bg-(--bg-dark) transition-all ease-in h-full aspect-square flex justify-center items-center bg-(--bg) rounded-sm">
												<i
													className={
														"group-hover:text-(--accent) transition-all ease-in fa-solid " +
														menuCategory.menuCategoryIcon
													}
												></i>
											</div>
											<div>
												<div className="font-bold">
													{
														menuCategory.menuCategoryName
													}
												</div>
												<div
													className={
														style.p_muted +
														"text-sm"
													}
												>
													{menuCategory.quantity}{" "}
													Barang
												</div>
											</div>
										</div>
									);
								})}
							</div>
							<div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-3">
								{selectedMenu.map((menu) => {
									if (
										menu.menuCategoryName ===
										currentCategory.menuCategoryName
									) {
										return (
											<div
												key={menu.menuName}
												className={
													style.card +
													"bg-(--bg-light) p-2 flex-row justify-start gap-2"
												}
											>
												<div className="h-full aspect-square bg-(--bg) flex justify-center items-center">
													<i
														className={
															"fa-2xl fa-solid " +
															currentCategory.menuCategoryIcon
														}
													></i>
												</div>
												<div>
													<div className="text-lg text">
														{menu.menuName}
													</div>
													<div className="w-fit flex justify-center gap-3 items-center bg-(--bg) rounded-sm p-1">
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-md cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-4"
															onClick={() => {
																addOrder(
																	menu.menuName,
																	-10
																);
															}}
														>
															<i className="fa-solid fa-minus"></i>
														</div>
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-xs cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-2"
															onClick={() => {
																addOrder(
																	menu.menuName,
																	-1
																);
															}}
														>
															<i className="fa-solid fa-minus"></i>
														</div>
														<div className="text-lg">
															{menu.quantity}
														</div>
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-xs cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-2"
															onClick={() => {
																addOrder(
																	menu.menuName,
																	1
																);
															}}
														>
															<i className="fa-solid fa-plus"></i>
														</div>
														<div
															className="bg-(--bg-light) w-7 h-7 flex justify-center items-center rounded-sm text-(--accent) text-md cursor-pointer hover:bg-(--accent) hover:text-(--bg-light) transition-all ease-in shadow-sm p-4"
															onClick={() => {
																addOrder(
																	menu.menuName,
																	10
																);
															}}
														>
															<i className="fa-solid fa-plus"></i>
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
							<label htmlFor="orderNumber">No. Nota</label>
							<input
								type="orderNumber"
								name=""
								id="orderNumber"
								onChange={(e) => {
									setOrderNumber(e.target.value);
								}}
								value={orderNumber}
								autoComplete="off"
								className={style.text_input + "w-fit"}
							/>
						</div>
						<div className="flex gap-2 items-center">
							<label htmlFor="orderTable">No. Meja</label>
							<input
								type="text"
								name=""
								id="orderTable"
								onChange={(e) => {
									setOrderTable(e.target.value);
								}}
								value={orderTable}
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
												orderType === type
													? style.radio_checked
													: style.radio
											}
										>
											<input
												type="radio"
												name="type"
												value={type}
												className="hidden"
												checked={orderTable === type}
												onChange={(e) =>
													setOrderType(e.target.value)
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
							{types[orderType].map((num) => {
								return (
									<div key={num}>
										<label
											// htmlFor={num}
											className={
												orderTable === num
													? style.radio_checked
													: style.radio
											}
										>
											<input
												type="radio"
												name="orderTable"
												value={num}
												className="hidden"
												checked={orderTable === num}
												onChange={(e) =>
													setOrderTable(
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
												orderType !==
												"Online" && "rounded-tr-sm"
										}
									>
										Item
									</th>
									{orderType !== "Online" && (
										<th className="border-l-1 border-(--bg-light) rounded-tr-sm p-1">
											Harga
										</th>
									)}
								</tr>
							</thead>
							<tbody>
								{selectedMenu.map((menu) => {
									if (menu.quantity > 0) {
										return (
											<tr
												key={menu.menuName}
												className="border-t-1 border-(--bg-light) bg-(--bg) text-center"
											>
												<td className="p-1">
													{menu.quantity}
												</td>
												<td className="border-l-1 border-(--bg-light) p-1">
													{menu.menuName}
												</td>
												{orderType !== "Online" && (
													<td className="border-l-1 border-(--bg-light) p-1">
														{(
															menu.menuPrice *
															menu.quantity
														).toLocaleString(
															"id-Id"
														)}
													</td>
												)}
											</tr>
										);
									}
								})}
								{orderType !== "Online" ? (
									<tr className="border-t-1 border-(--bg-light) bg-(--bg-dark)">
										<td
											colSpan={2}
											className="text-center font-bold rounded-bl-md p-1"
										>
											Total
										</td>
										<td className="border-l-1 p-1 border-(--bg-light) text-center rounded-br-md font-bold">
											{totalPrice.toLocaleString("id-Id")}
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
								return orderPaymentMethod === method ? (
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
											setOrderPaymentMethod(method);
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

export default NewEditOrder;

import React, { act, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
	const navigate = useNavigate();

	// setActiveOrders(2);
	// localStorage.setItem("activeOrders", 2);

	const [activeSales, setActiveSales] = useState([]);
	const [finishedSales, setFinishedSales] = useState([]);

	const fetchActiveSales = async () => {
		try {
			const res = await axios.get("http://localhost:3500/sales/");
			var tmp = [],
				tmp2 = [];
			res.data.forEach((sale) => {
				if (sale.status == "active") {
					tmp.push(sale);
				} else {
					tmp2.push(sale);
				}
			});
			setActiveSales(tmp);
			setFinishedSales(tmp2);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchItem = async (id) => {
		return await axios.get(`http://localhost:3500/items/${id}`);
	};

	useEffect(() => {
		fetchActiveSales();
	}, []);

	const printReceipt = (sale, total) => {
		let elementToPrint = document.getElementById(sale._id);
		let printContent = elementToPrint.innerHTML;

		const date = new Date(sale.date);
		const dateHTML = `Date: ${date.toISOString().split("T")[0]} ${
			date.toISOString().split("T")[1].split(".")[0]
		}`;

		let printWindow = window.open("", "", "height=1000,width=1000");
		printWindow.document.write(
			"<style>*{margin:0;padding:0;box-sizing:border-box}.container {width: 100%;display: flex;flex-direction: column;align-items: center;padding: 10px;} .price{text-align:right}table{width:100%}</style>"
		);
		printWindow.document.write(
			`<div class='container'><h3>Mie Celor 99 Poligon</h3><h4>Jl. Amanzi Water Park</h4><h4>Citra Grand City</h4><p>No. Nota: ${sale.number}</p><p>${dateHTML}</p><hr style='width: 100%'/><table>${printContent}<tfoot><tr><td colspan="3"><hr/></td</tr><tr><td colspan='2' style='font-weight: bold'>Total</td><td colspan='2' style='font-weight: bold' class='price'>${total}</td></tr></tfoot></table><p>Terima Kasih</p></div>`
		);
		printWindow.document.close();
		printWindow.print();
		printWindow.close();
	};

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3">
				<div
					className="px-3 py-1 bg-(--mint) text-(--white) w-fit cursor-pointer hover:bg-(--dark-mint)"
					onClick={() => {
						navigate("/orders/new");
					}}
				>
					New Order
				</div>
				<div className="text-2xl font-bold text-(--dark-mint) mt-2">
					Active Orders
				</div>

				<div className="flex gap-1 flex-wrap">
					{activeSales.map((sale) => {
						var total = 0;
						return (
							<div
								key={sale._id}
								className="w-70 min-h-50 bg-(--light-mint) p-2"
							>
								<p className="text-lg font-bold text-center">
									{sale.number}
								</p>
								<p>Table: {sale.tableNumber}</p>
								<table className="w-full">
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
									<tbody id={sale._id}>
										{sale.items.map((item) => {
											total += item.price * item.quantity;
											return (
												<tr key={item._id}>
													<td className="border-black border-2 text-center">
														{item.quantity}
													</td>
													<td className="border-black border-2 text-center">
														{item.name}
													</td>
													<td className="border-black border-2 text-center price">
														{item.price *
															item.quantity}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
								<div className="font-bold">Total: {total}</div>
								<div
									onClick={() => {
										navigate(`/orders/edit/${sale._id}`);
									}}
									className="px-3 py-1 bg-(--mint) text-(--white) w-fit cursor-pointer hover:bg-(--dark-mint)"
								>
									Edit
								</div>
								<div
									onClick={() => {
										printReceipt(sale, total);
									}}
									className="px-3 py-1 bg-(--mint) text-(--white) w-fit cursor-pointer hover:bg-(--dark-mint)"
								>
									Print
								</div>
							</div>
						);
					})}
				</div>

				<div className="text-2xl font-bold text-(--dark-mint) mt-2">
					Finished Orders
				</div>

				<div className="flex gap-1 flex-wrap">
					{finishedSales.map((sale) => {
						var total = 0;
						return (
							<div
								key={sale._id}
								className="w-70 min-h-50 bg-(--light-mint) p-2"
							>
								<p className="text-lg font-bold text-center">
									{sale.number}
								</p>
								<p>Table: {sale.tableNumber}</p>
								<table className="w-full">
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
									<tbody id={sale._id}>
										{sale.items.map((item) => {
											total += item.price * item.quantity;
											return (
												<tr key={item._id}>
													<td className="border-black border-2 text-center">
														{item.quantity}
													</td>
													<td className="border-black border-2 text-center">
														{item.name}
													</td>
													<td className="border-black border-2 text-center price">
														{item.price *
															item.quantity}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
								<div className="font-bold">Total: {total}</div>
								<div
									onClick={() => {
										printReceipt(sale, total);
									}}
									className="px-3 py-1 bg-(--mint) text-(--white) w-fit cursor-pointer hover:bg-(--dark-mint)"
								>
									Print
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default OrderList;

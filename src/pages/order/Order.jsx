import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { style } from "../../styles/style";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Order = ({ order }) => {
	const navigate = useNavigate();
	const { auth } = useAuth();
	const [manager, setManager] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	const axiosPrivate = useAxiosPrivate();

	const printKitchenReceipt = (order2, total) => {
		let elementToPrint = document.getElementById(order2._id);
		let printContent = elementToPrint.innerHTML;

		const date = new Date(order2.date);
		const dateHTML = `Date: ${date.toLocaleString("en-GB").split(",")[0]} ${
			date.toLocaleString("en-GB").split(",")[1]
		}`;

		let printWindow = window.open("", "_blank");

		printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    .container {
                        width: 100%;
                        background-color: aliceblue;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 10px;
                    }

                    .price {
                        display: none;
                    }

                    table {
                        width: 100%;
                    }

					.dont-show {
						display: none;
					}

					h4 {
						font-size: 30px
					}
                </style>
            </head>
            <body>
                <div class="container">
					<h4>${order.number}</h4>
                    <p>No. Meja: ${order.tableNumber}</p>
                    <p>${dateHTML}</p>
                    <hr style="width: 100%" />
                    <table>
                        <tbody>
                        ${printContent}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><hr /></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </body>
        </html>
        `);
		printWindow.document.close();

		// Give the browser a moment to render, then print
		printWindow.onload = () => {
			printWindow.print();
			printWindow.close();
		};
	};

	const printReceipt = (order2, total) => {
		let elementToPrint = document.getElementById(order2._id);
		let printContent = elementToPrint.innerHTML;

		const date = new Date(order2.date);
		const dateHTML = `Date: ${date.toLocaleString("en-GB").split(",")[0]} ${
			date.toLocaleString("en-GB").split(",")[1]
		}`;

		let printWindow = window.open("", "_blank");

		printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    .container {
                        width: 100%;
                        background-color: aliceblue;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 10px;
                    }

                    .price {
                        text-align: right;
                    }

                    table {
                        width: 100%;
                    }

					.dont-show {
						display: none;
					}
                </style>
            </head>
            <body>
                <div class="container">
                    <h3>Mie Celor 99 Poligon</h3>
                    <h4>Jl. Amanzi Water Park</h4>
					<h4>Citra Grand City</h4>
					<h4>0898 078 6688</h4>
                    <p>No. Nota: ${order.number}</p>
                    <p>No. Meja: ${order.tableNumber}</p>
                    <p>Kasir: ${order.cashier}</p>
                    <p>${dateHTML}</p>
                    <hr style="width: 100%" />
                    <table>
                        <tbody>
                        ${printContent}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><hr /></td>
                            </tr>
                            <tr>
                                <td colspan="2" style="font-weight: bold">Total</td>
                                <td class="price" style="font-weight: bold">${total}</td>
                            </tr>
                        </tfoot>
                    </table>
                    <p>Terima Kasih</p>
                </div>
            </body>
        </html>
        `);
		printWindow.document.close();

		// Give the browser a moment to render, then print
		printWindow.onload = () => {
			printWindow.print();
			printWindow.close();
		};
	};

	var total = 0;

	useEffect(() => {
		setManager(auth?.roles?.includes("Manager"));
	}, []);

	const deleteOrder = async (id) => {
		try {
			setIsDeleting(true);
			const res = await axiosPrivate({
				method: "DELETE",
				url: "sales",
				data: { id },
			});
			setIsDeleting(false);
			setIsDeleted(true);
			navigate("/orders");
		} catch (error) {
			setIsDeleting(false);
			if (error.code === 403) {
				navigate("/");
			}
		}
	};

	const convertTime = (date) => {
		date = new Date(date);
		// const date2 = date.toLocaleString();
		// const date2 = new Date(date);
		// console.log(date2);
		return (
			date.toLocaleString("id-ID", {
				year: "numeric",
				month: "numeric",
				day: "numeric",
			}) +
			" " +
			date.toLocaleString("en-US", {
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
				hourCycle: "h24",
			})
		);
	};

	return (
		<div
			key={order._id}
			className={
				style.card +
				"min-h-50 bg-(--bg-light) p-2 items-start justify-start hover:shadow-lg hover:scale-102 transition-all ease-out"
			}
		>
			<div className="w-full flex justify-center">
				<h2
					className={
						style.h2 +
						"bg-(--accent) text-(--bg-light) py-1 px-3 rounded-sm shadow-sm"
					}
				>
					{order.number}
				</h2>
			</div>
			<p>
				<b>Tipe:</b> {order.type}
			</p>
			<p>
				<b>Meja:</b> {order.tableNumber}
			</p>
			<p>
				<b>Kasir:</b> {order.cashier}
			</p>
			<p>
				<b>Tanggal: </b>
				{convertTime(order.date)}
			</p>
			{order.payment && (
				<p>
					<b>Pembayaran:</b> {order.payment}
				</p>
			)}
			<table className="w-full">
				<thead>
					<tr className="bg-(--bg-dark) text-(--text)">
						<th className="rounded-tl-sm p-1">Byk</th>
						<th
							className={
								"border-l-1 border-(--bg-light) p-1" +
									order.type !==
									"Online" && "rounded-tr-sm"
							}
						>
							Item
						</th>
						{order.type !== "Online" && (
							<th className="border-(--bg-light) border-l-1 p-1 rounded-tr-sm">
								Harga
							</th>
						)}
					</tr>
				</thead>
				<tbody id={order._id}>
					{order.items.map((item) => {
						total += item.price * item.quantity;
						return (
							<tr key={item._id}>
								<td className="border-t-1 border-(--bg-light) bg-(--bg) text-center">
									{item.quantity}
								</td>
								<td className="border-t-1 border-l-1 border-(--bg-light) bg-(--bg) text-center">
									{item.name}
								</td>
								{order.type !== "Online" && (
									<td className="border-t-1 border-l-1 border-(--bg-light) bg-(--bg) text-center price">
										{item.price * item.quantity}
									</td>
								)}
							</tr>
						);
					})}
					{order.type !== "Online" ? (
						<tr className="dont-show border-t-1 border-(--bg-light) bg-(--bg-dark)">
							<td
								colSpan={2}
								className="text-center font-bold rounded-bl-md p-1"
							>
								Total
							</td>
							<td className="border-l-1 p-1 border-(--bg-light) text-center rounded-br-md font-bold">
								{total}
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
			<div className="mt-2 flex gap-2">
				{order.status === "active" && (
					<div
						onClick={() => {
							navigate(`/orders/edit/${order._id}`);
						}}
						className={style.button}
					>
						<i className="fa-solid fa-pen-to-square"></i>
					</div>
				)}
				{order.status === "active" && (
					<div
						onClick={() => {
							printKitchenReceipt(order, total);
						}}
						className={
							style.button +
							"bg-(--light-gray) hover:bg-(--gray) text-(--bg-light)"
						}
					>
						<i className="fa-solid fa-print"></i>
					</div>
				)}
				{order.status === "finished" && (
					<div
						onClick={() => {
							printReceipt(order, total);
						}}
						className={
							style.button +
							"bg-(--light-gray) hover:bg-(--gray) text-(--bg-light)"
						}
					>
						<i className="fa-solid fa-print"></i>
					</div>
				)}
				{manager && (
					<div
						onClick={() => {
							!isDeleted ? deleteOrder(order._id) : () => {};
						}}
						className={
							style.button +
							"bg-(--alert-red) hover:bg-(--alert-red-dark) text-(--bg-light)"
						}
					>
						{isDeleted ? (
							<i className="fa-solid fa-check"></i>
						) : isDeleting ? (
							<i className="fa-solid fa-cog fa-spin"></i>
						) : (
							<i className="fa-solid fa-trash"></i>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Order;

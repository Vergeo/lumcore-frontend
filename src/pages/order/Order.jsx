import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Order = ({ sale }) => {
	const navigate = useNavigate();

	const printReceipt = (sale2, total) => {
		let elementToPrint = document.getElementById(sale2._id);
		let printContent = elementToPrint.innerHTML;

		const date = new Date(sale2.date);
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

	var total = 0;

	return (
		<div
			key={sale._id}
			className="w-80 min-h-50 bg-(--light-mint) p-2 rounded-sm shadow-sm"
		>
			<p className="text-xl font-bold text-center">{sale.number}</p>
			<p>
				<b>Meja:</b> {sale.tableNumber}
			</p>
			<table className="w-full">
				<thead className="bg-(--mint) text-white">
					<tr>
						<th className="rounded-tl-sm">Byk</th>
						<th className="border-(--light-mint) border-l-2">
							Item
						</th>
						<th className="border-(--light-mint) border-l-2 rounded-tr-sm">
							Harga
						</th>
					</tr>
				</thead>
				<tbody id={sale._id}>
					{sale.items.map((item) => {
						total += item.price * item.quantity;
						return (
							<tr key={item._id}>
								<td className="border-t-2 border-l-2 border-(--light-mint) bg-gray-200 text-center">
									{item.quantity}
								</td>
								<td className="border-t-2 border-l-2 border-(--light-mint) bg-gray-200 text-center">
									{item.name}
								</td>
								<td className="border-t-2 border-l-2 border-(--light-mint) bg-gray-200 text-center price">
									{item.price * item.quantity}
								</td>
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					<tr>
						<td
							colSpan={2}
							className="bg-gray-300 rounded-bl-sm border-t-2 border-(--light-mint) text-center font-bold"
						>
							Total
						</td>
						<td className="bg-gray-300 rounded-bl-sm border-t-2 border-l-2 border-(--light-mint) text-center rounded-br-md font-bold">
							{total}
						</td>
					</tr>
				</tfoot>
			</table>
			<div className="mt-2 flex gap-2">
				{sale.status === "active" && (
					<div
						onClick={() => {
							navigate(`/orders/edit/${sale._id}`);
						}}
						className="w-fit bg-(--mint) text-(--white) px-3 py-1 cursor-pointer hover:bg-(--dark-mint) rounded-sm transition-all ease-in"
					>
						Ubah
					</div>
				)}
				<div
					onClick={() => {
						printReceipt(sale, total);
					}}
					className="w-fit bg-(--mint) text-(--white) px-3 py-1 cursor-pointer hover:bg-(--dark-mint) rounded-sm transition-all ease-in"
				>
					Print
				</div>
			</div>
		</div>
	);
};

export default Order;

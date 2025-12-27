import ReactDOMServer from "react-dom/server";
import { axiosPrivate } from "../../api/axios";

const ReceiptContent = ({ order, showPrice }) => {
	let total = 0;

	return (
		<>
			{order.orderDetailPrint.map((menu) => {
				total += menu.menuPrice * menu.quantity;

				return (
					<tr key={menu.menuId}>
						<td>{menu.quantity}</td>
						<td>{menu.menuName}</td>
						{showPrice && (
							<td className="price">
								{(
									menu.menuPrice * menu.quantity
								).toLocaleString("id-ID")}
							</td>
						)}
					</tr>
				);
			})}
		</>
	);
};

const PrintReceipt = async (order, total) => {
	const printContent = ReactDOMServer.renderToString(
		<ReceiptContent order={order} showPrice={true} />
	);

	const employeeRes = await axiosPrivate.get(
		"employee/getEmployee/" + order.employeeId
	);

	const date = new Date(order.orderDate);
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
						font-size: 10pt;
                    }

                    .container {
                        width: 100%;
						border: 1px solid black;
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
                    <p>No. Nota: ${order.orderNumber}</p>
                    <p>No. Meja: ${order.orderTable}</p>
                    <p>Kasir: ${employeeRes.data.employeeName}</p>
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

export default PrintReceipt;

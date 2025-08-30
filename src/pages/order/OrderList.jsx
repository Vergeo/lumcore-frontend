import React, { act, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiRoot } from "../../config/apiRoot";
import Order from "./Order";

const OrderList = () => {
	const navigate = useNavigate();

	// setActiveOrders(2);
	// localStorage.setItem("activeOrders", 2);

	const [activeSales, setActiveSales] = useState([]);
	const [finishedSales, setFinishedSales] = useState([]);

	const fetchActiveSales = async () => {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const res = await axios.get(`${apiRoot}sales/`);
			var tmp = [],
				tmp2 = [];
			res.data.forEach((sale) => {
				const date2 = new Date(sale.date);
				date2.setHours(0, 0, 0, 0);
				if (today.getTime() === date2.getTime()) {
					if (sale.status == "active") {
						tmp.push(sale);
					} else {
						tmp2.push(sale);
					}
				}
			});
			setActiveSales(tmp);
			setFinishedSales(tmp2);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchItem = async (id) => {
		return await axios.get(`${apiRoot}tems/${id}`);
	};

	useEffect(() => {
		fetchActiveSales();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-[var(--white)] flex">
			<Navbar />
			<div className="w-full py-6 px-3">
				<div className="text-2xl font-bold text-(--dark-mint) mt">
					Pesanan Aktif
				</div>

				<div className="flex gap-2 flex-wrap">
					{activeSales.map((sale) => {
						return <Order sale={sale} key={sale._id} />;
					})}
				</div>

				<div className="text-2xl font-bold text-(--dark-mint) mt-2">
					Pesanan Selesai
				</div>

				<div className="flex gap-2 flex-wrap">
					{finishedSales.map((sale) => {
						var total = 0;
						return <Order sale={sale} key={sale._id} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default OrderList;

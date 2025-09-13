import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { style } from "../../styles/style";
import Order from "./Order";

const OrderList = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();

	const [activeOrders, setActiveOrders] = useState([]);
	const [finishedOrders, setFinishedOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const res = await axiosPrivate.get("sales");

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			res.data.forEach((order) => {
				const orderDate = new Date(order.date);
				orderDate.setHours(0, 0, 0, 0);

				if (today.getTime() === orderDate.getTime()) {
					if (order.status === "active") {
						setActiveOrders((prev) => [...prev, order]);
					} else {
						setFinishedOrders((prev) => [...prev, order]);
					}
				}
			});
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<h1 className={style.h1}>Daftar Pesanan Aktif</h1>
				{isLoading ? (
					<div className="flex justify-start items-center">
						<i className="fa-solid fa-cog fa-spin mr-2"></i>
						Mengambil Data Pesanan
					</div>
				) : (
					<div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-3">
						{activeOrders.map((order) => {
							return <Order order={order} key={order._id} />;
						})}
					</div>
				)}

				<h1 className={style.h1}>Daftar Pesanan Selesai</h1>
				{isLoading ? (
					<div className="flex justify-start items-center">
						<i className="fa-solid fa-cog fa-spin mr-2"></i>
						Mengambil Data Pesanan
					</div>
				) : (
					<div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-3">
						{finishedOrders.map((order) => {
							return <Order order={order} key={order._id} />;
						})}
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderList;

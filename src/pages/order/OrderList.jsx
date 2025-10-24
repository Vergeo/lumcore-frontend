import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { style } from "../../styles/style";
import Order from "./Order";
import useAuth from "../../hooks/useAuth";

const OrderList = () => {
	const navigate = useNavigate();
	const axiosPrivate = useAxiosPrivate();
	const { auth } = useAuth();
	const [manager, setManager] = useState(false);

	const [activeOrders, setActiveOrders] = useState([]);
	const [finishedOrders, setFinishedOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			const res = await axiosPrivate.get("sales");

			const tempActiveOrders = [];
			const tempFinishedOrders = [];

			const today = new Date(date);
			today.setHours(0, 0, 0, 0);

			res.data.forEach((order) => {
				const orderDate = new Date(order.date);
				orderDate.setHours(0, 0, 0, 0);

				if (today.getTime() === orderDate.getTime()) {
					if (order.status === "active") {
						tempActiveOrders.push(order);
					} else {
						tempFinishedOrders.push(order);
					}
				}
			});

			setActiveOrders(tempActiveOrders);
			setFinishedOrders(tempFinishedOrders);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			if (error.status === 403) {
				navigate("/");
			}
		}
	};

	useEffect(() => {
		setManager(auth?.roles?.includes("Manager"));
		fetchOrders();
	}, []);

	useEffect(() => {
		fetchOrders();
	}, [date]);

	return (
		<div className="w-screen min-h-screen bg-(--bg-dark) flex">
			<Navbar />
			<div className="w-full flex flex-col gap-6 p-6">
				<div className="flex justify-between">
					<h1 className={style.h1}>Daftar Pesanan Aktif</h1>
					{manager && (
						<input
							type="date"
							name=""
							id=""
							onChange={(e) => {
								setDate(e.target.value);
							}}
							value={date}
							className="bg-(--bg-light) hover:bg-(--accent-light) transition-all ease-in p-2 w-fit rounded-sm cursor-pointer shadow-md"
						/>
					)}
				</div>
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

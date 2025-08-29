import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login/Login";
import OrderList from "./pages/order/OrderList";
import ItemList from "./pages/items/ItemList";
import ItemNew from "./pages/items/ItemNew";
import ItemEdit from "./pages/items/ItemEdit";
import OrderNew from "./pages/order/OrderNew";
import OrderEdit from "./pages/order/OrderEdit";
import OrderRecap from "./pages/order/OrderRecap";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />

				<Route path="items">
					<Route index element={<ItemList />} />
					<Route path="new" element={<ItemNew />} />
					<Route path="edit/:itemId" element={<ItemEdit />} />
				</Route>

				<Route path="orders">
					<Route index element={<OrderList />} />
					<Route path="new" element={<OrderNew />} />
					<Route path="recap" element={<OrderRecap />} />
					<Route path="edit/:saleId" element={<OrderEdit />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

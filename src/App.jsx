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
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";

import EmployeeList from "./pages/employee/EmployeeList";
import CreateEmployee from "./pages/employee/CreateEmployee";
import EditEmployee from "./pages/employee/EditEmployee";
import CreateRole from "./pages/employee/CreateRole";
import EditRole from "./pages/employee/EditRole";

import StockList from "./pages/stock/StockList";
import CreateStock from "./pages/stock/CreateStock";
import EditStock from "./pages/stock/EditStock";
import CreateStockCategory from "./pages/stock/CreateStockCategory";
import EditStockCategory from "./pages/stock/EditStockCategory";
import StockMovementList from "./pages/stock/StockMovementList";
import StockRecap from "./pages/stock/StockRecap";
import StockEntry from "./pages/stock/StockEntry";
import AdjustStock from "./pages/stock/AdjustStock";

import MenuList from "./pages/menu/MenuList";
import CreateMenu from "./pages/menu/CreateMenu";
import EditMenu from "./pages/menu/EditMenu";
import CreateMenuCategory from "./pages/menu/CreateMenuCategory";
import EditMenuCategory from "./pages/menu/EditMenuCategory";

import NewOrderList from "./pages/newOrder/NewOrderList";
import NewCreateOrder from "./pages/newOrder/NewCreateOrder";
import NewEditOrder from "./pages/newOrder/NewEditOrder";
import NewOrderRecap from "./pages/newOrder/NewOrderRecap";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Login />} />

					<Route
						element={
							<RequireAuth
								allowedRoles={["Employee", "Manager", "Admin"]}
							/>
						}
					>
						<Route path="orders">
							<Route index element={<OrderList />} />
							<Route path="new" element={<OrderNew />} />
							<Route path="recap" element={<OrderRecap />} />
							<Route
								path="edit/:saleId"
								element={<OrderEdit />}
							/>
						</Route>

						<Route path="order">
							<Route index element={<NewOrderList />} />
							<Route path="create" element={<NewCreateOrder />} />
							<Route path="recap" element={<NewOrderRecap />} />
							<Route
								path="edit/:orderId"
								element={<NewEditOrder />}
							/>
						</Route>
						<Route path="stock">
							<Route path="recap" element={<StockRecap />} />
							<Route path="entry" element={<StockEntry />} />
							<Route path="adjust" element={<AdjustStock />} />
						</Route>
					</Route>

					<Route
						element={
							<RequireAuth allowedRoles={["Manager", "Admin"]} />
						}
					>
						<Route path="items">
							<Route index element={<ItemList />} />
							<Route path="new/:index" element={<ItemNew />} />
							<Route path="edit/:itemId" element={<ItemEdit />} />
						</Route>
						<Route path="employee">
							<Route index element={<EmployeeList />} />
							<Route path="create" element={<CreateEmployee />} />
							<Route
								path="edit/:employeeId"
								element={<EditEmployee />}
							/>
						</Route>
						<Route path="role">
							<Route path="create" element={<CreateRole />} />
							<Route path="edit/:roleId" element={<EditRole />} />
						</Route>
						<Route path="stock">
							<Route index element={<StockList />} />
							<Route path="create" element={<CreateStock />} />
							<Route
								path="movement"
								element={<StockMovementList />}
							/>
							<Route
								path="edit/:stockId"
								element={<EditStock />}
							/>
						</Route>
						<Route path="stockCategory">
							<Route
								path="create"
								element={<CreateStockCategory />}
							/>
							<Route
								path="edit/:stockCategoryId"
								element={<EditStockCategory />}
							/>
						</Route>
						<Route path="menu">
							<Route index element={<MenuList />} />
							<Route path="create" element={<CreateMenu />} />
							<Route path="edit/:menuId" element={<EditMenu />} />
						</Route>
						<Route path="menuCategory">
							<Route
								path="create"
								element={<CreateMenuCategory />}
							/>
							<Route
								path="edit/:menuCategoryId"
								element={<EditMenuCategory />}
							/>
						</Route>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;

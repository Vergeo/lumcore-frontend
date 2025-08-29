import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiRoot } from "../../config/apiRoot";

const Users = () => {
	const [users, setUsers] = useState([]);

	const fetchUsers = async () => {
		try {
			const res = await axios.get(`${apiRoot}users/`);
			setUsers(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className="flex flex-col w-screen min-h-screen ">
			<h1 className="">Users</h1>
			{users.map((user) => {
				return (
					<div key={user._id}>
						<h5>Username</h5>
						<p>{user.username}</p>
						<h5>Status</h5>
						<p>{user.status}</p>
						<h5>Roles</h5>
						<p>{user.roles}</p>
					</div>
				);
			})}
		</div>
	);
};

export default Users;

import React, { createContext, useContext, useEffect, useState } from "react";

const currentUserContext = createContext();

const CurrentUserContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(0);

	useEffect(() => {
		const currentUserStorage = localStorage.getItem("currentUser");

		if (currentUserStorage) {
			setCurrentUser(currentUserStorage);
		}
	}, []);

	return (
		<currentUserContext.Provider value={{ currentUser, setCurrentUser }}>
			{children}
		</currentUserContext.Provider>
	);
};

export default CurrentUserContextProvider;

export const getCurrentUser = () => {
	return useContext(currentUserContext);
};

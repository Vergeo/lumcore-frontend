import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import { style } from "../../styles/style";

const Login = () => {
	const navigate = useNavigate();

	const { auth, setAuth } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			setIsVerifying(true);
			const employeeObject = { username, password };
			const res = await axios.post("/auth", employeeObject, {
				withCredentials: true,
			});

			const { userId, roles, accessToken } = res.data;
			await setAuth({ userId, username, roles, accessToken });
			// console.log("Going to /order");
			navigate("/order");
			setIsVerifying(false);
		} catch (err) {
			console.log(err);
			setErrorMessage(
				err?.response?.data?.message ||
					"Login gagal. Silahkan coba lagi."
			);
			setIsVerifying(false);
		}
	};

	return (
		<div
			className={
				style.accent_gradient +
				"w-screen h-screen flex flex-col items-center justify-center"
			}
		>
			<h1 className={style.title + "text-(--bg-light)"}>Lumcore</h1>
			<h2
				className={
					style.subtitle + "text-center mb-5 text-(--bg-light)"
				}
			>
				Mie Celor 99 Poligon POS
			</h2>
			<div className={style.card + "w-90 h-90" + style.bg_gradient}>
				<form className="flex flex-col w-4/5 gap-5">
					<h1 className={style.h1 + "text-center"}>Login</h1>
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-1">
							<label htmlFor="username" className="">
								Nama Pengguna
							</label>
							<input
								type="text"
								id="username"
								autoComplete="off"
								onChange={(e) => {
									setUsername(e.target.value);
								}}
								value={username}
								className={style.p_muted + style.text_input}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="password">Kata Sandi</label>
							<input
								type="password"
								id="password"
								autoComplete="off"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								value={password}
								className={style.p_muted + style.text_input}
							/>
						</div>
					</div>
					{errorMessage && (
						<div className={style.error + "text-center"}>
							{errorMessage}
						</div>
					)}
					<div className="flex flex-col items-center">
						<button
							onClick={handleLogin}
							disabled={isVerifying}
							className={
								isVerifying ? style.button_muted : style.button
							}
						>
							{!isVerifying ? (
								<div>Masuk</div>
							) : (
								<div className="flex justify-center items-center">
									<i className="fa-solid fa-cog fa-spin mr-2"></i>
									Memverifikasi
								</div>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;

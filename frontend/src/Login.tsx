import { useEffect, useState, SyntheticEvent, useContext } from "react";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { ContextAuth } from "./context/AuthContext";
import axiosInstance from "./context/AxiosConfig";
import Footer from "./components/Footer";

const Login = () => {
	const { isLogedIn, setIsLogedIn, csrfToken, setCsrfToken, get_current_user_or_log_out } = useContext(ContextAuth);
	const [error, setError] = useState<string>("");
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const history = useHistory();

	const get_csrf = async () => {
		await axiosInstance.get("/api/users/get_csrf", {
			withCredentials: true,
		});
		setCsrfToken(Cookies.get("csrftoken")!);
	};

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			const response = await axiosInstance("/api/users/login", {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken!,
				},
				method: "POST",
				withCredentials: true,
				data: JSON.stringify(user),
			});
			if (response.status === 200) {
				setIsLogedIn(true);
				setCsrfToken(Cookies.get("csrftoken")!);
				get_current_user_or_log_out();
				history.push("/");
			} else {
				setError("Username or password Incorrect");
				throw new Error(error);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		get_csrf();
		document.title = "Login";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return isLogedIn ? (
		<div className='text-black bg-white container px-5 py-24 mx-auto flex flex-wrap items-center'>
			{" "}
			You are already logged in! Go to{" "}
			<a href='/' className='text-blue-300 underline ml-1'>
				{" "}
				Home
			</a>
		</div>
	) : (
		<div>
			<section className='text-black bg-white body-font '>
				<div className='container px-5 py-24 mx-auto flex flex-wrap items-center'>
					<div className='lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0'>
						<h1 className='title-font font-medium text-3xl text-black'>Log In!</h1>
						<p className='leading-relaxed mt-4'>
							Basic Chat by{" "}
							<a
								href='https://github.com/TomasSanchez'
								className='hover:text-gray-100 ml-1'
								target='_blank'
								rel='noopener noreferrer'>
								@TomasSanchez
							</a>
						</p>
					</div>
					<div className='lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto border border-gray-200 shadow-lg w-full mt-10 md:mt-0 mr-16'>
						<h2 className='text-Black text-lg  font-medium title-font mb-5'>Login</h2>
						{error && (
							<h2 className='lg:w-2/6 md:w-1/2 text-red-300 w-auto' style={{ width: "auto" }}>
								{error}
							</h2>
						)}
						<form onSubmit={handleSubmit}>
							<div className='relative mb-4'>
								<label htmlFor='email' className='leading-7 text-sm text-gray-700'>
									Email
								</label>
								<input
									type='email'
									id='email'
									name='email'
									value={user.email}
									onChange={(e) =>
										setUser({
											...user,
											email: e.target.value,
										})
									}
									className='w-full bg-gray-500 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
								/>
							</div>
							<div className='relative mb-4'>
								<label htmlFor='password' className='leading-7 text-sm text-gray-700'>
									Password
								</label>
								<input
									type='password'
									id='password'
									name='password'
									value={user.password}
									onChange={(e) =>
										setUser({
											...user,
											password: e.target.value,
										})
									}
									className='w-full bg-gray-500 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-900 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
								/>
							</div>
							<button
								type='submit'
								className='text-white bg-indigo-700 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>
								Login
							</button>
						</form>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Login;

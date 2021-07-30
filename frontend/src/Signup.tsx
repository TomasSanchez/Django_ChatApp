import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { SyntheticEvent } from "react";
import { ContextAuth } from "./context/AuthContext";
import axiosInstance from "./context/AxiosConfig";

const Signup = () => {
	document.title = "SignUp";
	const history = useHistory();
	const [emailError, setEmailError] = useState("");
	const [userNameError, setUserNameError] = useState("");
	const [generalError, setGeneralError] = useState("");
	const [user, setUser] = useState({
		email: "",
		user_name: "",
		first_name: "",
		last_name: "",
		password: "",
	});
	const { isLogedIn, csrfToken } = useContext(ContextAuth);

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		const response = await axiosInstance("/api/users/create", {
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": csrfToken!,
			},
			method: "POST",
			withCredentials: true,
			data: JSON.stringify(user),
		});
		const jsres = response.data;

		if (response.status === 201) {
			// ADD modal 'acc created succesfully' then redirect
			history.push("/login");
		} else {
			if (jsres.email) {
				setEmailError("User with this Email already exists");
				setUser({ ...user, email: "" });
				console.log("email in: ", emailError);
			}
			if (jsres.user_name) {
				setUserNameError("User with this Username already exists");
				setUser({ ...user, user_name: "" });
				console.log("username in: ", userNameError);
			}
			if (!jsres.user_name && !jsres.email) {
				setUser({
					email: "",
					user_name: "",
					first_name: "",
					last_name: "",
					password: "",
				});
				setGeneralError("Something went wrong, please try again");
				console.log("error");
			}
		}
	};

	return isLogedIn ? (
		<div>
			<div className='text-gray-300 bg-gray-900 container px-5 pt-24 mx-auto flex flex-wrap items-center'>
				{" "}
				You are already logged in! Go to{" "}
				<a href='/' className='text-red-300 underline ml-1'>
					{" "}
					Home
				</a>
			</div>
			<div className='text-gray-300 bg-gray-900 container px-5 mx-auto flex flex-wrap items-center'>
				If you want to create an account please Log out
			</div>
		</div>
	) : (
		<div>
			<div className='p-8 bg-gray-100 shadow-lg border border-gray-200 flex flex-col md:ml-auto w-full md:px-56 md:rounded-lg md:mt-10 height: 81.99vh; container m-auto'>
				<form action='' onSubmit={handleSubmit}>
					<div className='flex flex-row '>
						<h2 className='text-black text-lg font-medium title-font mb-5'>Sign Up</h2>
						<div className='text-red-500 ml-2 flex-1 text-right text-sm leading-7'>{generalError}</div>
					</div>
					<div className='relative mb-4'>
						<div className='flex flex-row '>
							<label htmlFor='full-name' className='leading-7 text-sm text-gray-700'>
								First Name
							</label>
							<div className='text-red-500 ml-2 flex-1 text-right text-sm leading-7'>
								{user.first_name.length >= 90 && "Max length reached"}
							</div>
						</div>
						<input
							type='text'
							id='first-name'
							name='first-name'
							value={user.first_name}
							onChange={(e) => setUser({ ...user, first_name: e.target.value })}
							className='w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
							maxLength={90}
						/>
					</div>
					<div className='relative mb-4'>
						<div className='flex flex-row '>
							<label htmlFor='full-name' className='leading-7 text-sm text-gray-700'>
								Last Name
							</label>
							<div className='text-red-500 ml-2 flex-1 text-right text-sm leading-7'>
								{user.last_name.length >= 90 && "Max length reached"}
							</div>
						</div>
						<input
							type='text'
							id='last-name'
							name='last-name'
							value={user.last_name}
							onChange={(e) => setUser({ ...user, last_name: e.target.value })}
							className='w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
							maxLength={90}
						/>
					</div>
					<div className='relative mb-4'>
						<div className='flex flex-row '>
							<label htmlFor='email' className='leading-7 text-sm text-gray-700'>
								Email
							</label>
							<div className='text-red-500 ml-2 flex-1 text-right text-sm leading-7'>{emailError}</div>
						</div>
						<input
							type='email'
							id='email'
							name='email'
							value={user.email}
							onChange={(e) => setUser({ ...user, email: e.target.value })}
							className='w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
						/>
					</div>
					<div className='relative mb-4'>
						<div className='flex flex-row '>
							<label htmlFor='user-name' className='leading-7 text-sm text-gray-700'>
								User Name
							</label>
							<div className='text-red-500 ml-2 flex-1 text-right text-sm leading-7'>
								{user.user_name.length >= 90 && "Max length reached"}
							</div>

							{/* <div className='text-red-500 ml-2 flex-1 text-right text-sm leading-7'>{"asd"}</div> */}
						</div>
						<input
							type='user-name'
							id='user-name'
							name='user-name'
							value={user.user_name}
							onChange={(e) => setUser({ ...user, user_name: e.target.value })}
							className='w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
							maxLength={90}
						/>
					</div>
					<div className='relative mb-4'>
						<label htmlFor='email' className='leading-7 text-sm text-gray-700'>
							Password
						</label>
						<input
							type='password'
							id='password'
							name='password'
							value={user.password}
							onChange={(e) => setUser({ ...user, password: e.target.value })}
							className='w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
						/>
					</div>
					<div className='text-red-500'>
						{!(user.first_name && user.last_name && user.password && user.user_name && user.email) &&
							"Please fill all the slots"}
					</div>
					<button
						disabled={!(user.first_name && user.last_name && user.password && user.user_name && user.email)}
						type='submit'
						className='text-white bg-indigo-700 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'>
						Button
					</button>
				</form>
			</div>
			{/* <Footer /> */}
		</div>
	);
};

export default Signup;

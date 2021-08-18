import { useEffect, useState } from "react";
import { createContext } from "react";
import Cookies from "js-cookie";
import axiosInstance from "./AxiosConfig";

type userType = {
	id: number;
	email: string;
	user_name: string;
	first_name: string;
	last_name: string;
};

type AuthProps = {
	isLogedIn: boolean | undefined;
	setIsLogedIn: (value: boolean) => void;
	csrfToken: string | undefined;
	setCsrfToken: (value: string) => void;
	current_logged_user: userType | undefined;
	get_current_user_or_log_out: VoidFunction;
};

const initialState = {
	isLogedIn: undefined,
	setIsLogedIn: (value: boolean) => undefined,
	csrfToken: "",
	setCsrfToken: (value: string) => undefined,
	current_logged_user: undefined,
	get_current_user_or_log_out: () => undefined,
};

export const ContextAuth = createContext<AuthProps>(initialState);

const AuthContext = ({ children }: any) => {
	const [isLogedIn, setIsLogedIn] = useState<boolean | undefined>(undefined);
	const [csrfToken, setCsrfToken] = useState<string | undefined>("");
	const [current_logged_user, setUser] = useState();

	const get_current_user_or_log_out = async () => {
		const response = await axiosInstance("/api/users/me", {
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": csrfToken,
			},
			withCredentials: true,
		});

		if (response.status === 200) {
			if (response.data.detail === "LoggedIn") {
				setIsLogedIn(true);
				setCsrfToken(Cookies.get("csrftoken"));
				setUser(response.data.user);
			} else if (response.data.detail === "AnonymousUser") {
				setIsLogedIn(false);
			}
		}
	};

	const AuthContextValues = {
		isLogedIn,
		setIsLogedIn,
		csrfToken,
		setCsrfToken,
		current_logged_user,
		get_current_user_or_log_out,
	};

	useEffect(() => {
		get_current_user_or_log_out();
		// eslint-disable-next-line
	}, []);
	return <ContextAuth.Provider value={AuthContextValues}>{children}</ContextAuth.Provider>;
};

export default AuthContext;

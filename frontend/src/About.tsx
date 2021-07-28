import { useEffect, useState } from "react";
import axiosInstance from "./context/AxiosConfig";

const About = () => {
	const [testData, setTestData] = useState([]);

	const getTestData = async () => {
		const response = await axiosInstance("/api/users/", {
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("response: ", response);
		if (response.status === 200) {
			setTestData(response.data);
		}
	};

	useEffect(() => {
		getTestData();
	}, []);

	return testData ? (
		<div className='container bg-green-400 text-center text-black p-2 flex m-auto mt-28 h-48 rounded-3xl'>
			<h1 className='flex align-middle text-center'>Hello im a div testing tailwind and routing</h1>
			{testData.map((user: any) => (
				<div className='container p-5 bg-blue-400'>{user.id}</div>
			))}
		</div>
	) : (
		<div>Loading</div>
	);
};

export default About;

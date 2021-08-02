import { useEffect, useState, useContext } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useParams } from "react-router-dom";
import { ContextAuth } from "./context/AuthContext";
import { useHistory } from "react-router-dom";

const Chat = () => {
	const { isLogedIn, current_logged_user } = useContext(ContextAuth);
	const [input, setInput] = useState<string>("");
	const [client, setClient] = useState<W3CWebSocket>();
	const { id } = useParams<{ id: string }>();
	const history = useHistory();
	// const [messages, setMessages] = useState([
	// 	{ text: "1mas vale", author: "" },
	// 	{ text: "2Hola como estas", author: "" },
	// 	{ text: "3asd42134", author: "" },
	// ]);

	useEffect(() => {
		const client = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/private/${id}/`);
		setClient(client);
		// eslint-disable-next-line
	}, []);

	if (client) {
		client.onopen = () => {
			console.log("OPEN, WebSocket Client Connected");
		};
		client.onmessage = (message) => {
			console.log("message:", message);
		};
		client.onerror = (error) => {
			console.error("error:", error);
		};
		client.onclose = (message) => {
			console.log("close:", message);
		};
	}
	const handleSubmit = (text: string) => {
		client!.send(JSON.stringify({ message: text, user: current_logged_user }));
		setInput("");
	};

	const handleClose = () => {
		client!.close();
	};
	// !isLogedIn
	return false ? (
		<div className='container mx-auto w-2/3 bg-gray-200 text-gray-800'>
			<div>Log In to view your chats!</div>
		</div>
	) : (
		// Start of left container
		<div className='flex flex-row'>
			<div className='container h-96 w-1/3 bg-red-200  m-auto flex flex-col'>
				<div className=' hidden sm:flex flex-row text-xs bg-gray-400 px-2 py-4 align-middle justify-start'>
					{" "}
					<div className='flex '>
						<input
							className='flex rounded-lg bg-gray-300 px-2 py-1 text-gray-900'
							type='text'
							placeholder='Search'
						/>
					</div>
					<button className='hover:text-gray-800 hover:underline align-middle flex'>Search</button>
				</div>
				{/* Start of map */}
				<div className='flex border-t border-gray-300 px-2 py-5 bg-gray-200 hover:bg-gray-300'>
					<div className='flex flex-col' style={{ width: "-webkit-fill-available" }}>
						<p className='text-gray-900 '>Name</p>
						<div className=' flex flex-row text-xs'>
							<div className='mr-2'>
								<p>//</p>
							</div>
							<div className='flex text-gray-900 w-3/4'>
								<p>LastMessage</p>
							</div>
							<div className=' sm:block hidden text-gray-900 '>
								<p>Time</p>
							</div>
						</div>
					</div>
				</div>
				{/* end of map */}
			</div>
			{/* Start of the right container */}
			<div className='container h-96 bg-yellow-200 w-full m-auto flex'></div>
		</div>
	);
};

export default Chat;

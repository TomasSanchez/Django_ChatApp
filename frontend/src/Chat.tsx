import { useEffect, useState, useContext } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useParams } from "react-router-dom";
import { ContextAuth } from "./context/AuthContext";

const Chat = () => {
	const { isLogedIn, current_logged_user } = useContext(ContextAuth);
	const [input, setInput] = useState<string>("");
	const [client, setClient] = useState<W3CWebSocket>();
	const { id } = useParams<{ id: string }>();
	const [messages, setMessages] = useState([
		{ text: "1mas vale", author: "" },
		{ text: "2Hola como estas", author: "" },
		{ text: "3asd42134", author: "" },
	]);

	useEffect(() => {
		const client = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/private/${id}/`);
		setClient(client);
	}, []);

	if (!isLogedIn) {
		// gotohome
	}

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

	return (
		<div>
			<section className='text-gray-600 body-font'>
				<div className='container mx-auto flex flex-col px-5 py-24 justify-center items-center'>
					<div className='text-left flex justify-start '>
						<h2 className='text-3xl'>Chat</h2>
					</div>
					<div className='w-full md:w-2/3 flex flex-col mb-16 items-center text-center'>
						<div className='sm:h-96 bg-purple-200 border-2 border-black flex-col-reverse overflow-y-scroll flex w-full h-96'>
							{messages.map((message: any) => (
								<div className='flex items-start'>{message.text}</div>
							))}
						</div>
						<div className='flex w-full justify-center items-end'>
							<div className='relative mr-4 lg:w-full xl:w-1/2 w-2/4 md:w-full text-left mt-9'>
								<input
									type='text'
									id='hero-field'
									name='hero-field'
									className='w-full bg-gray-100 bg-opacity-50 rounded focus:ring-2 focus:ring-green-200 focus:bg-transparent border border-gray-300 focus:border-green-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
									value={input}
									onChange={(e) => setInput(e.target.value)}
								/>
							</div>
							<button
								onClick={() => handleSubmit(input)}
								className='inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg'>
								{">"}
							</button>
							<button
								onClick={() => handleClose()}
								className='inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg'>
								Close
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Chat;

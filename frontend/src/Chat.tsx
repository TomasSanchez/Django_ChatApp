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
	const handleSubmit = () => {
		// client!.send(JSON.stringify({ message: input, user: current_logged_user }));
		alert(input);
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
		<div className='rounded-xl mx-4 my-2 sm:my-10 shadow-lg h-5/6 p-1 bg-gray-500'>
			<div className='flex flex-row items-start h-full '>
				{/* Pink LEFT */}
				<div className='container w-1/3 bg-gray-300 overflow-y-auto flex flex-col h-full border-r border-gray-400 rounded-xl rounded-r-none '>
					{/* Search */}
					<div className=' hidden sm:flex flex-row text-xs bg-gray-400 px-2 py-4 align-middle justify-start'>
						{" "}
						<div className='flex '>
							<input
								className='flex rounded-lg bg-gray-300 px-2 py-1 text-gray-900'
								type='text'
								placeholder='Search'
							/>
						</div>
						<button className='hover:text-gray-800 hover:underline align-middle hidden md:flex'>
							Search
						</button>
					</div>

					{/* Start of map */}
					<div className='flex border-t border-gray-300 px-1 py-5 bg-gray-200 hover:bg-gray-100'>
						<div className='flex flex-col' style={{ width: "-webkit-fill-available" }}>
							<p className='text-gray-900 h-6 overflow-hidden '>Name tomas solano sanchez</p>
							<div className=' flex flex-row text-xs'>
								<div className='mr-2'>
									<p>//</p>
								</div>
								<div className='flex text-gray-900 w-3/4'>
									<p className='h-4 overflow-hidden'>
										LastMessage Hola como te va pedazo de gil hola salamenca
									</p>
								</div>
								<div className=' sm:block hidden text-gray-900 '>
									<p>Time</p>
								</div>
							</div>
						</div>
					</div>
					{/* end of map */}
				</div>
				{/* YELLOW RIGHT Start of the right container */}
				<div className='flex flex-col h-full  w-full mx-auto '>
					<div className=' flex flex-col-reverse bg-blue-200 w-full h-full rounded-xl rounded-l-none rounded-b-none overflow-y-auto'>
						{/* beggining of map */}

						<div className={`flex flex-grow-1 justify-start `}>
							<div
								className={`mx-2 my-1 items-start px-2 py-3 rounded-md border max-w-xs sm:max-w-sm md:max-w-md xl:max-w-xl flex-grow-0  border-gray-300 bg-gray-200 min-w-0 text-left shadow-xs`}>
								<p className='text-xs text-gray-500'>from</p>
								<p className='text-black'>
									message.te akjsdh ajkhd jasdh jkashdjas hjjkdhasdj asdj ashd ashdjahs jhakdjxt
								</p>
							</div>
						</div>
						{/* asd */}
						<div className={`flex flex-grow-1 justify-end `}>
							<div
								className={`mx-2 my-1 items-start px-2 py-3 rounded-md border max-w-xs sm:max-w-sm md:max-w-md xl:max-w-xl flex-grow-0  border-gray-300 bg-gray-200 min-w-0 text-left shadow-xs`}>
								<p className='text-xs text-gray-500'>from</p>
								<p className='text-black'>
									message.text asdjkh asjdh asjkdh akjshd jashd jashd jahsd hasjdh akjhda adkjh asjd
									hasjkdh ask
								</p>
							</div>
						</div>

						{/* endof map */}
					</div>
					<div className='h-16 bg-gray-200 w-full rounded-xl rounded-l-none rounded-t-none flex'>
						<input
							className='w-11/12 my-2 mx-1 p-2 rounded-lg border border-gray-300 bg-gray-100'
							type='text'
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<button
							onClick={handleSubmit}
							className='mr-2 my-2 p-2 rounded-2xl bg-green-500 w-1/12 text-white'>
							{" "}
							{">"}{" "}
						</button>
					</div>
				</div>
				{/* End of right */}
			</div>
		</div>
	);
};

export default Chat;

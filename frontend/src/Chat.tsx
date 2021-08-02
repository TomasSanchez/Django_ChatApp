import { useEffect, useState, useContext, SyntheticEvent } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { ContextAuth } from "./context/AuthContext";
import axiosInstance from "./context/AxiosConfig";

type userType = {
	user_id: number;
	user_name: string;
	first_name: string;
	last_name: string;
};

type messageType = {
	id: number;
	author: userType;
	created_at: string;
	content: string;
	chat_group_id: number | null;
	chat_private_id: number | null;
};

type chatType = {
	created_at: string;
	group_name: string;
	id: string;
	messages: messageType;
	users: userType[];
};

const Chat = () => {
	const { isLogedIn, csrfToken, current_logged_user } = useContext(ContextAuth);
	const [input, setInput] = useState<string>("");
	const [chats, setChats] = useState<chatType[]>();
	const [disabled, setDisabled] = useState(false);
	const [activeChat, setActiveChat] = useState<string>();
	const [messages, setMessages] = useState<messageType[]>();
	const [client, setClient] = useState<W3CWebSocket>();

	// gets called on page open, gets all chats from current loged user
	const getChats = async () => {
		try {
			const response = await axiosInstance("/api/chat/chats", {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken,
				},
				withCredentials: true,
			});

			if (response.status === 200) {
				console.log("data: ", response.data);
				setChats(response.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// gets called upong click of chat and gets all messages of selected chat
	const getMessages = async (id: string) => {
		try {
			const response = await axiosInstance(`/api/chat/messages/${id}`, {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken,
				},
				withCredentials: true,
			});

			if (response.status === 200) {
				console.log("Messages: ", response.data);

				setMessages(response.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getChats();
		// eslint-disable-next-line
	}, []);

	if (client) {
		client.onopen = () => {
			console.log("OPEN, WebSocket Client Connected");
		};
		client.onmessage = (message) => {
			const data = JSON.parse(message.data as string).data;
			updateMessages(data);
		};
		client.onerror = (error) => {
			console.error("error:", error);
		};
		client.onclose = (message) => {
			console.log("close:", message);
		};
	}

	const updateMessages = (message: messageType) => {
		setMessages((prevMessages) => [message, ...prevMessages!]);
	};

	const handleEnable = () => {
		setTimeout(() => {
			console.log("AntiSpam!");
			setDisabled((prev) => !prev);
		}, 2000);
	};

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		if (isLogedIn) {
			setDisabled(true);
			client!.send(JSON.stringify({ message: input, user: current_logged_user }));
			setInput("");
			handleEnable();
		}
	};

	const handleChatView = (id: string) => {
		// close client if predefined before for another chat, if clicked on same chat prevent over connections
		if (activeChat !== id) {
			if (client) {
				client.close();
			}
			const socketClient = new W3CWebSocket(`ws://127.0.0.1:8000/ws/chat/private/${id}/`);
			setClient(socketClient);
			getMessages(id);
			setActiveChat(id);
			setInput("");
		}
	};

	const comparing_author = (author_id: number) => {
		return author_id === current_logged_user!.id;
	};

	// !isLogedIn
	return false ? (
		<div className='container mx-auto w-2/3 bg-gray-200 text-gray-800 mt-12 rounded-lg p-4 text-xl'>
			<div>Log In to view your chats!</div>
		</div>
	) : (
		<div className='rounded-xl mx-4 my-2 sm:my-10 shadow-lg h-5/6 p-1 bg-gray-500'>
			<div className='flex flex-row items-start h-full '>
				{/*LEFT panel */}
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
						<button className='hover:text-gray-800 hover:underline align-middle hidden md:flex p-1'>
							SearchTODO
						</button>
						<button className='hover:text-gray-800 hover:underline align-middle hidden md:flex p-1 ml-2'>
							CreateTODO
						</button>
					</div>

					{/* Start of chats map */}
					{!chats ? (
						<div className='p-4'>Loading chats!</div>
					) : (
						chats!.map((chat: chatType) => (
							<div
								key={chat.id}
								className='flex border-t border-gray-300 px-1 py-5 bg-gray-200 hover:bg-gray-100'
								onClick={() => handleChatView(chat.id)}>
								<div className='flex flex-col' style={{ width: "-webkit-fill-available" }}>
									<p className='text-gray-900 h-6 overflow-hidden '>{chat.group_name}</p>
									<div className=' flex flex-row text-xs'>
										<div className='mr-2'>
											<p>{"//"}</p>
										</div>
										{/* <div className='flex text-gray-900 w-3/4'>
											<p className='h-4 overflow-hidden'>{chat.messages.content}</p>
										</div>
										<div className=' sm:block hidden text-gray-900 justify-self-end '>
											<p>{chat.messages.created_at.split("T")[0].split(".")[0].slice(0, 5)}</p>
										</div> */}
									</div>
								</div>
							</div>
						))
					)}
					{/* end of map */}
				</div>
				{/* RIGHT Panel Start of the right container messages view */}

				<div className='flex flex-col h-full  w-full mx-auto '>
					{!activeChat ? (
						<div className=' flex flex-col-reverse bg-blue-200 w-full h-full rounded-xl rounded-l-none rounded-b-none overflow-y-auto justify-items-center'>
							<div className='m-auto rounded-xl bg-gray-300 px-3 py-5 text-xl sm:text-2xl md:text-4xl text-gray-600 border-2 border-gray-400 mt-20 mx-5 sm:mx-auto'>
								Select a chat to show messages
							</div>
						</div>
					) : (
						<>
							<div className=' flex flex-col-reverse bg-blue-200 w-full h-full rounded-xl rounded-l-none rounded-b-none overflow-y-auto'>
								{/* beggining of map */}
								{!messages ? (
									<div className=''>Loading Messages</div>
								) : (
									messages!.map((message: messageType) => (
										<div
											className={`flex flex-grow-1 ${
												comparing_author(message.author.user_id)
													? "justify-end"
													: "justify-start"
											} `}
											key={message.id}>
											<div
												className={`mx-2 my-1 items-start px-2 py-3 rounded-md border max-w-xs sm:max-w-sm md:max-w-md xl:max-w-xl flex-grow-0  border-gray-300 bg-gray-200 min-w-0 text-left shadow-xs`}>
												<p className='text-xs text-gray-500'>
													From:{" "}
													{comparing_author(message.author.user_id)
														? "You"
														: "From: " + message.author.user_name}
												</p>
												<p className='text-black'>{message.content}</p>
											</div>
										</div>
									))
								)}
								{/* end of map */}
							</div>
							{/* Input field and submit */}
							<form
								onSubmit={handleSubmit}
								className='h-16 bg-gray-200 w-full rounded-xl rounded-l-none rounded-t-none flex'>
								<input
									className='w-11/12 my-2 mx-1 p-2 rounded-lg border border-gray-300 bg-gray-100'
									type='text'
									value={input}
									onChange={(e) => setInput(e.target.value)}
									disabled={disabled}
								/>
								<button
									disabled={disabled}
									type='submit'
									className='mr-2 my-2 p-2 rounded-2xl bg-green-500 w-1/12 text-white'>
									{" "}
									{">"}{" "}
								</button>
							</form>
						</>
					)}
					{/* End of right panel */}
				</div>
			</div>
		</div>
	);
};

export default Chat;

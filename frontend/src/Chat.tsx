import { useEffect, useState, useContext, SyntheticEvent } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { ContextAuth } from "./context/AuthContext";
import axiosInstance from "./context/AxiosConfig";

type messageChatType = {
	id: string;
	group_name: string;
	created_at: string;
};

type userType = {
	user_id: string;
	user_name: string;
	first_name: string;
	last_name: string;
};

type messageType = {
	id: string;
	author: userType;
	created_at: string;
	content: string;
	chat_group_id: number | null;
	private_chat: messageChatType;
};

type chatType = {
	created_at: string;
	group_name: string;
	id: string;
	messages: messageType;
	users: userType[];
};

const orderByLastMessage: (chats: chatType[]) => chatType[] = (chats: chatType[]) => {
	let new_chats = chats.sort((firstEl, secondEl) =>
		firstEl.messages.created_at < secondEl.messages.created_at
			? 1
			: secondEl.messages.created_at < firstEl.messages.created_at
			? -1
			: 0
	);
	return new_chats;
};

const Chat = () => {
	const wsErrors = [
		{ error: "Connecting", readyState: 0 },
		{ error: "Connected", readyState: 1 },
		{ error: "Closing", readyState: 2 },
		{ error: "Connection Lost", readyState: 3 },
	];
	const { isLogedIn, csrfToken, current_logged_user } = useContext(ContextAuth);
	const [input, setInput] = useState<string>(""); // input text from chat view
	const [chats, setChats] = useState<chatType[]>(); // All the chats/groups without their messages
	const [client, setClient] = useState<W3CWebSocket>(); // websocket client
	const [disabled, setDisabled] = useState<boolean>(false); // Disables input for 2 seconds after enter to prevent spaming
	const [messages, setMessages] = useState<messageType[]>(); // Messages of a specific chat/group
	const [activeChat, setActiveChat] = useState<string>(); // Current chat to show messages from
	const [joinGroupName, setJoinGroupName] = useState<string>(""); // input text from search view
	const [newGroupName, setNewGroupName] = useState<string>(""); // input text from search view
	const [wsConectingError, setWsConectingError] = useState(wsErrors[0]); // Display current connection status

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
				console.log(response.data);
				setChats(response.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (chats) {
		orderByLastMessage(chats!);
	}

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

	const createGroup = async (chatName: string) => {
		try {
			const response = await axiosInstance(`/api/chat/chat/create`, {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken,
				},
				withCredentials: true,
				method: "POST",
				data: JSON.stringify({ group_name: chatName }),
			});

			if (response.status === 201) {
				setNewGroupName("");
				getChats();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const joinGroup = async (chatName: string) => {
		try {
			const response = await axiosInstance(`/api/chat/join/${chatName}`, {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken,
				},
				withCredentials: true,
				method: "PUT",
			});

			if (response.status === 202) {
				console.log(response.data);
				getChats();
				setJoinGroupName("");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const leaveGroup = async (chatName: string) => {
		try {
			const response = await axiosInstance(`/api/chat/join/${chatName}`, {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken,
				},
				withCredentials: true,
				method: "PUT",
			});

			if (response.status === 202) {
				console.log(response.data);
				client!.close();
				getChats();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const deleteGroup = async (chatId: string) => {
		try {
			const response = await axiosInstance(`/api/chat/delete/${chatId}`, {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": csrfToken,
				},
				withCredentials: true,
				method: "DELETE",
			});
			if (response.status === 204) {
				getChats();
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
			setWsConectingError(wsErrors[client.readyState]);
			console.log("OPEN, WebSocket Client Connected");
		};
		client.onmessage = (message) => {
			const data = JSON.parse(message.data as string).data;
			updateMessages(data);
		};
		client.onerror = (error) => {
			console.error("error:", error);
			setWsConectingError(wsErrors[client.readyState]);
		};
		client.onclose = (message) => {
			console.log("close:", message);
			setWsConectingError(wsErrors[client.readyState]);
		};
	}

	const updateMessages = (message: messageType) => {
		console.log("incoming message:", message);
		setMessages((prevMessages) => [message, ...prevMessages!]);
		const current_chat = chats?.find((chat) => chat.id === message.private_chat.id);
		current_chat!.messages.content = message.content;
		current_chat!.messages.author = message.author;
		current_chat!.messages.created_at = message.created_at;
	};

	const handleDelete = (chatId: string) => {
		deleteGroup(chatId);
	};

	const handleCreate = (chatName: string) => {
		createGroup(chatName);
	};

	const handleJoin = (chatName: string) => {
		joinGroup(chatName);
	};

	const handleLeave = (e: SyntheticEvent, chatName: string) => {
		console.log("This ran");
		e.stopPropagation();
		leaveGroup(chatName);
	};

	const handleEnable = () => {
		setDisabled(true);
		setTimeout(() => {
			console.log("AntiSpam!");
			setDisabled((prev) => !prev);
		}, 2000);
	};

	const handleSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		if (isLogedIn && client!.readyState) {
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
			setWsConectingError(wsErrors[socketClient.readyState]);
			setClient(socketClient);
			getMessages(id);
			setActiveChat(id);
			setInput("");
		}
	};

	const comparing_author = (author_id: string) => {
		return parseInt(author_id) === current_logged_user!.id;
	};

	return !isLogedIn ? (
		<div className='container mx-auto w-2/3 bg-gray-200 text-gray-800 mt-12  p-4 text-xl'>
			<div>Log In to view your chats!</div>
		</div>
	) : (
		<div className=' md:h-93/100 p-1 bg-gray-500  h-80/100'>
			<div className='flex flex-row items-start h-full '>
				{/*LEFT panel */}
				<div className='container w-1/3 bg-gray-300 overflow-y-auto flex flex-col h-full border-r border-gray-400  rounded-r-none '>
					{/* Search */}
					<div className=' hidden sm:block md:flex-col xl:flex xl:flex-row text-xs bg-gray-400 px-2 py-4 align-middle justify-start'>
						{" "}
						{/* CREATE GROUP */}
						<div className='flex my-1'>
							<input
								className=' bg-gray-300 px-2 py-1 text-gray-900 rounded-lg xl:max-w-120p'
								type='text'
								placeholder='New Group Name'
								value={newGroupName}
								onChange={(e) => setNewGroupName(e.target.value)}
								maxLength={15}
							/>
							<button
								className='hover:text-gray-800 hover:underline align-middle flex p-1 ml-2'
								onClick={() => handleCreate(newGroupName)}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4 hover:text-gray-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z'
									/>
								</svg>
							</button>
						</div>
						{/* JOIN GROUP */}
						<div className='flex xl:ml-4 my-1'>
							<input
								className='flex bg-gray-300 px-2 py-1 text-gray-900 rounded-lg xl:max-w-120p'
								type='text'
								placeholder='Join Group'
								value={joinGroupName}
								onChange={(e) => setJoinGroupName(e.target.value)}
								maxLength={15}
							/>
							<button
								className='hover:text-gray-800 hover:underline align-middle flex p-1 ml-2'
								onClick={() => handleJoin(joinGroupName)}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4 hover:text-gray-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
									/>
								</svg>
							</button>
						</div>
					</div>
					{!chats ? (
						<div className='p-4'>Loading chats!</div>
					) : !(chats.length > 0) ? (
						<div className='flex border-t border-gray-300 px-2 py-3 sm:py-5 bg-yellow-100 bg-opacity-60'>
							{" "}
							No chats yet! Create or Join a group chat
						</div>
					) : (
						chats!.map((chat: chatType) => (
							<div
								key={chat.id}
								className='flex border-t border-gray-300 px-2 py-3 sm:py-5 bg-gray-200 hover:bg-gray-100'
								onClick={() => handleChatView(chat.id)}>
								<div className='flex flex-col' style={{ width: "-webkit-fill-available" }}>
									<div className='flex justify-between'>
										<p className='text-gray-900 h-6 overflow-hidden '>{chat.group_name}</p>
										<button
											className='text-red-800'
											onClick={(e) => handleLeave(e, chat.group_name)}>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-5 w-5'
												viewBox='0 0 20 20'
												fill='currentColor'>
												<path
													fillRule='evenodd'
													d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
													clipRule='evenodd'
												/>
											</svg>
										</button>
									</div>
									<div className=' sm:flex sm:flex-row text-xs justify-between'>
										<div className='text-gray-900 overflow-hidden'>
											<p className='h-4'>
												{"//  "}
												{parseInt(chat.messages.id) > 0
													? chat.messages.author.user_name + ": " + chat.messages.content
													: "No messages yet"}
											</p>
										</div>
										<div className=' text-gray-900 sm:ml-4 pt-1 sm:pt-0'>
											<p>
												{parseInt(chat.messages.id) > 0
													? chat.messages.created_at.split("T")[1].split(".")[0].slice(0, 5)
													: ""}
											</p>
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
				{/* RIGHT Panel Start of the right container messages view */}
				<div className='flex flex-col h-full  w-full mx-auto '>
					{!activeChat ? (
						<div className=' flex flex-col-reverse bg-blue-200 w-full h-full  rounded-l-none overflow-y-auto justify-items-center'>
							<div className='m-auto  bg-gray-300 px-3 py-5 text-xl sm:text-2xl md:text-4xl text-gray-600 border-2 border-gray-400 mt-20 mx-5 sm:mx-auto'>
								Select a chat to show messages
							</div>
						</div>
					) : (
						<>
							<div className='h-16 bg-gray-200 w-full  rounded-l-none rounded-b-none flex shadow-md border-b border-gray-300 justify-between align-middle items-center'>
								<div className='mx-1 p-2 '>
									{chats!.find((chat) => chat.id === activeChat)?.group_name}
								</div>
								<div className='flex'>
									<button onClick={() => handleDelete(activeChat)}>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-4 w-4 hover:text-gray-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
											/>
										</svg>
									</button>
									<div className='mx-1 p-2 text-sm'>
										Status:{" "}
										{wsConectingError.readyState === client!.readyState && wsConectingError.error}
									</div>
								</div>
							</div>
							<div className=' flex flex-col-reverse bg-blue-200 w-full h-full  rounded-l-none rounded-b-none rounded-t-none overflow-y-auto'>
								{!messages ? (
									<div className=''>Loading Messages</div>
								) : (
									messages!.map((message: messageType) => (
										<div
											className={`flex flex-grow-1 ${
												comparing_author(message.author.user_id)
													? "justify-end mr-10"
													: "justify-start ml-10"
											} `}
											key={message.id}>
											<div
												className={`mx-2 my-1 items-start px-2 py-3 rounded-md border border-gray-300 max-w-xs sm:max-w-sm md:max-w-md xl:max-w-xl flex-grow-0 bg-gray-200 min-w-0 text-left shadow-xs`}>
												<div className='text-xs text-gray-500 flex justify-between'>
													<p className=''>
														{comparing_author(message.author.user_id)
															? "You"
															: "From: " + message.author.user_name}{" "}
													</p>
													<p className='ml-1'>
														{" " +
															message.created_at.split("T")[1].split(".")[0].slice(0, 5)}
													</p>
												</div>
												<p className='text-black'>{message.content}</p>
											</div>
										</div>
									))
								)}
							</div>
							{/* Input field and submit */}
							<form
								onSubmit={handleSubmit}
								className='h-16 bg-gray-200 w-full  rounded-l-none rounded-t-none flex'>
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

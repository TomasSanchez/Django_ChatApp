import { useState } from "react";
// import WebSocketClient from 'websocket'
// var WebSocketClient = require("websocket").client;
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:8000/ws/chat/room_4/");

const Chat = () => {
	const [input, setInput] = useState("");

	client.onopen = () => {
		console.log("WebSocket Client Connected");
	};

	client.onmessage = (message) => {
		console.log(message);
	};
	// const client = WebSocketClient();

	// client.on("connectFailed", function (error: any) {
	// 	console.log("Connect Error: " + error.toString());
	// });

	// client.on("connect", function (connection: any) {
	// 	console.log("WebSocket Client Connected");
	// 	connection.on("error", function (error: any) {
	// 		console.log("Connection Error: " + error.toString());
	// 	});
	// 	connection.on("close", function () {
	// 		console.log("echo-protocol Connection Closed");
	// 	});
	// 	connection.on("message", function (message: any) {
	// 		if (message.type === "utf8") {
	// 			console.log("Received: '" + message.utf8Data + "'");
	// 		}
	// 	});

	// 	function sendNumber() {
	// 		if (connection.connected) {
	// 			var number = Math.round(Math.random() * 0xffffff);
	// 			connection.sendUTF(number.toString());
	// 			setTimeout(sendNumber, 1000);
	// 		}
	// 	}
	// 	sendNumber();
	// });

	// client.connect("ws://localhost:8000/");

	return (
		<div>
			<section className='text-gray-600 body-font'>
				<div className='container mx-auto flex flex-col px-5 py-24 justify-center items-center'>
					<div className='text-left flex justify-start '>
						<h2 className='text-3xl'>Chat</h2>
					</div>
					<div className='w-full md:w-2/3 flex flex-col mb-16 items-center text-center'>
						<div className='sm:h-96 bg-purple-300 border-2 border-yellow-400 w-full h-96'></div>
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
							<button className='inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg'>
								{">" + input}
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Chat;

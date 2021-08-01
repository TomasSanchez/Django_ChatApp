import { useState } from "react";
import "./styles/index.css";

const App = () => {
	const [chatRoom, setChatRoom] = useState("");

	return (
		<div>
			<section className='text-gray-600 body-font relative xl:mt-32'>
				<div className='container px-5 py-24 mx-auto'>
					<div className='flex flex-col text-center w-full mb-12'>
						<h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900'>
							Basic Chat App
						</h1>
					</div>
					<div className='lg:w-1/2 md:w-2/3 mx-auto'>
						<div className='flex mx-auto flex-wrap -m-2 justify-center'>
							{/* <div className='p-2 w-1/2'>
								<div className='relative'>
									<label htmlFor='name' className='leading-7 text-sm text-gray-600'>
										Name
									</label>
									<input
										type='text'
										className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
									/>
								</div>
							</div> */}
							<div className='p-2 '>
								<div className='relative'>
									<label htmlFor='email' className='leading-7 text-sm text-gray-600'>
										ChatRoom
									</label>
									<input
										type='text'
										className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
										value={chatRoom}
										onChange={(e) => setChatRoom(e.target.value)}
									/>
								</div>
							</div>

							<div className='p-2 w-full'>
								<a
									href={`/chat/${chatRoom}`}
									className='flex mx-auto text-white bg-green-500 border-0 py-2 px-8 w-1/3  focus:outline-none hover:bg-green-600 rounded text-lg'>
									Enter
								</a>
							</div>
							<div className='p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center'>
								<a
									href='https://github.com/TomasSanchez/Django_ChatApp'
									className='text-green-500'
									target='_blank'
									rel='noopener noreferrer'>
									Project Git Repo
								</a>
								<br />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* <Footer /> */}
		</div>
	);
};

export default App;

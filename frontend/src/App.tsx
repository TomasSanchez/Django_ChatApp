import { useState } from "react";
import Footer from "./components/Footer";
import "./styles/index.css";

const App = () => {
	// Annonnymus user name, for not logged users
	const [annonName, setAnnonName] = useState("");

	return (
		<div>
			<div className='md:h-84/100 h-60/100'>
				<section className='h-full text-gray-600 body-font relative md:mt-12 xl:mt-16 my-5 rounded-lg border border-gray-300 shadow-xl mx-5 bg-gray-100 sm:mx-20 md:mx-40 xl:mx-96'>
					<div className=' px-5 py-8 sm:py-24 mx-auto'>
						<div className='flex flex-col text-center w-full mb-12'>
							<h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900'>
								Basic Chat App
							</h1>
						</div>
						<div className='lg:w-1/2 md:w-2/3 mx-auto'>
							<div className='flex mx-auto flex-wrap -m-2 justify-center'>
								<p className='text-center mx-auto mb-2'>
									Log In to create rooms and have chats with saving messages and basic functionallity.{" "}
									<br /> Or enter a generic public room where anyone can join and send messages.
								</p>
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
										<label className='leading-7 text-sm text-gray-600'>Display Name</label>
										<input
											type='text'
											className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
											value={annonName}
											onChange={(e) => setAnnonName(e.target.value)}
											maxLength={10}
										/>
									</div>
								</div>

								<div className='p-2 w-full flex justify-center'>
									<div className='inline-flex bg-green-500 hover:bg-green-600 rounded'>
										<a
											href={`/chat/public?display_name=${annonName}`}
											className='flex mx-auto text-white  border-0 py-2 px-4 focus:outline-none text-lg'>
											Enter public room
										</a>
									</div>
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
			</div>
			<Footer />
		</div>
	);
};

export default App;

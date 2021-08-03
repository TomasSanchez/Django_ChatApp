import Navbar from "./components/Navbar";

const Dummy = () => {
	return (
		<div className='h-screen w-full'>
			<div className='navbar container top-0 w-full abosulute bg-indigo-200 h-1/20 '></div>
			{/* navbar ends */}
			<div className='p-10 bg-pink-200 h-screen w-full overflow-auto '>
				<div className='p-10 border-2 border-purple-300'></div>
			</div>
		</div>
	);
};

export default Dummy;

import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./About";
import App from "./App";
import Chat from "./Chat";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthContext from "./context/AuthContext";
import Login from "./Login";
import Signup from "./Signup";
import SimpleChat from "./SimpleChat";
import "./styles/index.css";

ReactDOM.render(
	<AuthContext>
		<Navbar />
		<Router>
			<Switch>
				<Route exact path='/' component={App} />
				<Route path='/chat' component={Chat} />
				<Route path='/simplechat' component={SimpleChat} />
				<Route path='/login' component={Login} />
				<Route path='/signup' component={Signup} />
				<Route path='/about' component={About} />
			</Switch>
		</Router>
		<Footer />
	</AuthContext>,

	document.getElementById("root")
);

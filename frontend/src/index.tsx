import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./About";
import App from "./App";
import Chat from "./Chat";
import Navbar from "./components/Navbar";
import AuthContext from "./context/AuthContext";
import Dummy from "./Dummy";
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
				<Route exact path='/chat/public' component={SimpleChat} />
				<Route exact path='/chat' component={Chat} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/signup' component={Signup} />
				<Route exact path='/about' component={About} />
				<Route exact path='/dummy' component={Dummy} />
			</Switch>
		</Router>
	</AuthContext>,

	document.getElementById("root")
);

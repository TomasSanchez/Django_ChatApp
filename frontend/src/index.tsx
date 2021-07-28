import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./About";
import App from "./App";
import Chat from "./Chat";
import "./styles/index.css";

ReactDOM.render(
	<Router>
		<Switch>
			<Route exact path='/' component={App} />
			<Route path='/chat' component={Chat} />
			<Route path='/about' component={About} />
		</Switch>
	</Router>,
	document.getElementById("root")
);

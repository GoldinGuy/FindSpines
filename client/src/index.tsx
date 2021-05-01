import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";
import SpineDetectionPage from "./views/SpineDetectionPage";
import { Header } from "./components";

// styles
import "../src/styles/tailwind.output.css";
import "../src/styles/extended_styles.css";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<div className="bg-grayer h-screen overflow-x-hidden overflow-y-scroll">
				<Header />
				<Switch>
					<Route path="/" exact component={SpineDetectionPage} />
				</Switch>
			</div>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);

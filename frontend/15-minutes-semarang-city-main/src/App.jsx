import React, { useState } from "react";
import MainPage from "./pages/MainPage";
import MapPage from "./pages/MapPage";
import "./styles/responsive.css";

function App() {
	const [showMap, setShowMap] = useState(false);

	console.log("App rendered, showMap:", showMap);

	if (showMap) {
		return <MapPage />;
	}

	return <MainPage onCheckLocation={() => setShowMap(true)} />;
}

export default App;

// import React, { useState } from "react";
// import MainPage from "./pages/MainPage";
// import MapPage from "./pages/MapPage";	
// import "./styles/responsive.css";

// function App() {
	// const [showMap, setShowMap] = useState(false);

// 	console.log("App rendered, showMap:", showMap);

// 	if (showMap) {
// 		return <MapPage />;
// 	}

	// return <MainPage onCheckLocation={() => setShowMap(true)} />;
// }

// export default App;

import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import MainPage from './pages/MainPage';
import MapPage from './pages/MapPage';
import DashboardAdmin from './pages/DashboardAdmin';
import Login from './pages/Login';
import './styles/responsive.css';

const isAuthenticated = () => {
	return localStorage.getItem('token') !== null;
}

const ProtectedRoute = ({children}) => {
	if(!isAuthenticated()){
		return <Navigate to="/admin/login" replace />
	}
	return children;
}


function MainPageWrapper() {
  const navigate = useNavigate();

  return <MainPage onCheckLocation={() => navigate("/map")} />;
}
function App(){	
	return(
		<Router>
			<Routes>
				<Route path="/" element={<MainPageWrapper />} />
				<Route path="/map" element={<MapPage />} />
				<Route path="/admin/login" element={<Login />} />
				<Route path="/admin/dashboard" element={
					<ProtectedRoute>	
						<DashboardAdmin />
					</ProtectedRoute>
				} />
			</Routes>
		</Router>
	)
}


export default App;
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Reset from "./pages/Reset.jsx";
import Recover from "./pages/Recover.jsx";
import Verify from "./pages/Verify.jsx";
import ProfileAccount from "./pages/ProfileAccount.jsx";
//import Create from "./pages/Create.jsx";
//import Discover from "./pages/Discover.jsx";
import NoMatch from "./pages/NoMatch.jsx";
//import Following from "./pages/Following.jsx";
//import Posts from "./pages/Posts.jsx";
//import Followers from "./pages/Followers.jsx";
//import Follow from "./pages/Follow.jsx";
import Settings from "./pages/Settings.jsx";
import ProtectedRoutes from './utils/ProtectedRoutes';
import UnprotectedRoutes from './utils/UnprotectedRoutes';

import { ModalProvider } from './context/modal'; 
import { UserProvider } from "./context/user";
import { DatabaseProvider } from "./context/database";

import "./styles/index.css"


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
<React.StrictMode>
	<UserProvider>
		<DatabaseProvider>
			<ModalProvider>
				<BrowserRouter>
					<Routes>
						{/*ProtectedRoutes only a logged in user can access these endpoints*/}
						<Route element={<ProtectedRoutes/>}>
							<Route path="/" element={<Home />} />
							<Route path="/settings" element={<Settings />} />
						</Route>

						{/*UnprotectedRoutes a logged in user cannot access these */}
						<Route element={<UnprotectedRoutes/>}>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/reset" element={<Reset />} />
							<Route path="/recover" element={<Recover />} />
							<Route path="/verify" element={<Verify />} />
						</Route>
						
						<Route path="/:profile" element={<ProfileAccount />} />
						<Route path="/*" element={<NoMatch />} />

						{/*<Route element={<ProtectedRoutes/>}>
							<Route path="/" element={<Home />} />
							<Route path="/follow" element={<Follow />} />
							<Route path="/create" element={<Create />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/discover" element={<Discover />} />
							<Route path="/:profile/posts" element={<Posts />} />
							<Route path="/:profile" element={<ProfileAccount />} />
							<Route path="/:profile/following" element={<Following />} />
							<Route path="/:profile/followers" element={<Followers />} />
						</Route>*/}
					</Routes>
				</BrowserRouter>
			</ModalProvider>
		</DatabaseProvider>
	</UserProvider>
</React.StrictMode>,
);
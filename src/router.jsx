import { createBrowserRouter } from "react-router-dom";
import App from './App'
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Feed from "./components/Feed";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./components/CreatePost";
import Posts from "./components/Posts";

export const router = createBrowserRouter([
    {path: "/", element: <App />},
    {path: "/signup", element: <Signup />},
    {path: "/signin", element: <Signin />},
    {path: "/feed", element: (<PrivateRoute> <Feed /> </PrivateRoute>),},
    {path: "/create-post", element: (<PrivateRoute> <CreatePost/> </PrivateRoute>) },
    {path: "/posts", element: (<PrivateRoute> <Posts/> </PrivateRoute>) },
]);
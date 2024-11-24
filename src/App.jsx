import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import toast, { Toaster } from "react-hot-toast";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Context, server } from "./main";

function App() {
  const { setUser, setIsAuthenticated, setLoading } = useContext(Context);

  useEffect(() => {
    const fetching = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${server}/users/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        // console.error(error); // Log the error for debugging
        toast.error(error.response.data.message);
        setUser({});
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Ensure loading state is set to false regardless of success or failure
      }
    };
    fetching();
  }, [setIsAuthenticated, setLoading, setUser]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;

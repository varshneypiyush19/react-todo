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
      await axios
        .get(`${server}/users/me`, {
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data.user);
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setUser({});
          setIsAuthenticated(false);
          setLoading(false);
        });
    };
    fetching();
  }, []);

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

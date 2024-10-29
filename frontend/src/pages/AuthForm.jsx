import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import toast from "react-hot-toast";
import googleIcon from "../assets/google.png";
import { authWithGoogle } from "../utils/firebase";
function AuthForm({ type }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { token } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleFormSubmit() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/${type}`,
        userData
      );

      dispatch(setUser(response.data.user));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handleGoogleAuth() {
    try {
      let data = await authWithGoogle();

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-auth`,
        { accessToken: data.accessToken }
      );
      dispatch(setUser(response.data.user));
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    document.title = type === "signin" ? "Login" : "Register";

    setUserData({
      name: "",
      email: "",
      password: "",
    });
  }, [type]);
  if (token) {
    return navigate("/");
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px)]">
      {/* <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          {type === "signin" ? "Login" : "Register"}
        </h1>
        <form id="asfddsf">
          {type === "signup" && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <Link
              to={type === "signin" ? "/signup" : "/signin"}
              className="text-blue-500"
            >
              {type === "signin"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleFormSubmit}
            >
              {type === "signin" ? "Login" : "Register"}
            </button>
          </div>
        </form>
      </div> */}
      <button
        onClick={handleGoogleAuth}
        className="bg-black text-white rounded-full py-3 px-6 text-xl capitalize hover:bg-opacity-80 flex items-center justify-center gap-4  center"
      >
        <img src={googleIcon} alt="" className="w-5" />
        continue with Google
      </button>
    </div>
  );
}

export default AuthForm;

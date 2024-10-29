import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { removeUser } from "../store/userSlice";

function Navbar() {
  const { token, name , profilePic } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <>
      <nav className="bg-gray-800 p-4 h-[70px]">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Calendar App
          </Link>
          <div className="flex gap-6 text-white text-xl">
            <Link to="/all-event" className="hover:underline">
              All Events
            </Link>
          </div>
          <div className="flex items-center">
            {token ? (
              <>
                <Link
                  onClick={() => dispatch(removeUser())}
                  to="/signin"
                  className="text-white mr-4 text-xl"
                >
                  Logout
                </Link>
                <h2 className="text-white text-xl">{name}</h2>
                <img
                  src={profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${name}`}
                  alt="profile"
                  className="w-10 h-10 rounded-full ml-4"
                />
              </>
            ) : (
              <>
                <Link to="/signin" className="text-white mr-4">
                  Login
                </Link>
                <Link to="/signup" className="text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;

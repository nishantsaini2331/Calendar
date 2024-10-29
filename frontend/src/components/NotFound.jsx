import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          404 - Not Found
        </h1>
        <Link to="/" className="text-blue-500">
          Go back to the main page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

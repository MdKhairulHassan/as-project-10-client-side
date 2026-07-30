import { Link } from 'react-router';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

const Error = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-6">
      <div className="max-w-xl w-full rounded-3xl bg-base-100 shadow-2xl border border-base-300 p-10 text-center">
        {/* Icon */}
        <div className="mx-auto w-24 h-24 rounded-full bg-linear-to-br from-violet-600 to-emerald-500 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>

        {/* Error Code */}
        <h1 className="mt-8 text-7xl font-extrabold text-primary">404</h1>

        {/* Title */}
        <h2 className="mt-3 text-3xl font-bold text-base-content">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-base-content/70 leading-7">
          The page you're looking for doesn't exist or may have been moved.
          Please return to the homepage or refresh the application.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <Link
            to="/"
            className="btn border-none rounded-xl text-white bg-linear-to-r from-violet-600 to-fuchsia-500 hover:scale-105 duration-300"
          >
            <Home size={18} />
            Go Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline rounded-xl hover:scale-105 duration-300"
          >
            <RotateCcw size={18} />
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;

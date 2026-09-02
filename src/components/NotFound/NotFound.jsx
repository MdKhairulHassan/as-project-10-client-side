// =======================================
// import { use } from 'react';
// import { AuthContext } from '../../provider/AuthContext';
// import { ThemeContext } from '../../provider/ThemeContext';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
// import AxiosUseAuthProvider from '../../provider/AxiosUseAuthProvider';

const NotFound = () => {
  // const [{ logOut }, { theme }] = AxiosUseAuthProvider();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center px-6 py-20">
      <div className="rounded-3xl bg-base-300 shadow-2xl border border-base-300 px-10 py-8 max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-violet-600 to-emerald-500 flex items-center justify-center shadow-lg">
          <AlertTriangle size={34} className="text-white" />
        </div>

        {/* Error Code */}
        <h1 className="mt-8 text-7xl font-extrabold text-primary">404</h1>

        {/* Title */}
        <h2 className="mt-3 text-3xl font-bold text-base-content">
          Oops! Element Not Found
        </h2>

        {/* Description */}
        <p className="mt-4 text-base-content/70 leading-7">
          The page you're looking for doesn't exist or may have been moved.
          Please return to the homepage or refresh the application.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="btn border-none rounded-xl text-white bg-linear-to-r from-violet-600 to-fuchsia-500 hover:scale-105 duration-300"
          >
            <Home size={18} />
            Go Back
          </button>

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

export default NotFound;

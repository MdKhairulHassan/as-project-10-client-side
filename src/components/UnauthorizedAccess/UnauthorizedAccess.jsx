import { ShieldAlert } from 'lucide-react';
import { use } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../provider/AuthContext';
import { ThemeContext } from '../../provider/ThemeContext';
import { useNavigate } from 'react-router';

const UnauthorizedAccess = () => {
  const { logOut } = use(AuthContext);
  const { theme } = use(ThemeContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    console.log('user trying to logout');
    await logOut()
      .then(() => {
        navigate('/auth/login');
        // Sign-out successful.
        // alert('You sign-out successfully');
        toast('logOut successfully', {
          theme: theme,
          style: {
            // backgroundColor: 'yellow',
            color: 'green',
            fontWeight: 'bold',
          },
          // progressStyle: {
          //   background: 'green',
          // },
        });
      })
      .catch(error => {
        // An error happened.
        // console.log(error);
        // const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage, {
          theme: theme,
        });
      });
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-base-300 rounded-3xl shadow-xl border border-error/20 px-10 py-8 max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-r from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
          <ShieldAlert size={34} />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-3xl font-bold text-error">
          Unauthorized Access
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-lg text-base-content/80">
          Your session is invalid or has expired.
        </p>

        {/* Description */}
        <p className="mt-4 text-sm leading-7 text-base-content/60 px-4">
          We couldn't verify your identity. Please sign in again to continue
          using your account. If the problem persists, try logging out and
          logging back in. Maybe your authentication information is no longer
          valid.
        </p>

        <div className="divider my-6"></div>

        <p className="text-sm text-base-content/60">
          Try refreshing the page first. If the problem continues, sign in
          again.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-primary"
          >
            Refresh Page
          </button>

          <button
            onClick={handleLogOut}
            className="btn bg-linear-to-r from-violet-600 to-fuchsia-500 border-0 text-white hover:scale-105 transition-all"
          >
            Sign In Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;

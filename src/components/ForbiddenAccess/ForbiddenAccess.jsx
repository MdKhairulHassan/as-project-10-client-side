import { ShieldAlert } from 'lucide-react';
import { use } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../provider/AuthContext';
import { ThemeContext } from '../../provider/ThemeContext';
import { useNavigate } from 'react-router';

const ForbiddenAccess = () => {
  const { logOut } = use(AuthContext);
  const { theme } = use(ThemeContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logOut();

      toast.success('Signed out successfully.', {
        theme,
      });

      navigate('/auth/login');
    } catch (error) {
      toast.error(error.message, {
        theme,
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-base-300 rounded-3xl shadow-xl border border-error/20 px-10 py-8 max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-r from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
          <ShieldAlert size={34} />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-3xl font-bold text-error">Access Forbidden</h2>

        {/* Subtitle */}
        <p className="mt-3 text-lg text-base-content/80">
          You don't have permission to access this resource.
        </p>

        {/* Description */}
        <p className="mt-4 text-sm leading-7 text-base-content/60 px-4">
          The server verified your identity, but this request is not allowed.
          This can happen if your account information doesn't match the
          requested resource or your authentication information is no longer
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

export default ForbiddenAccess;

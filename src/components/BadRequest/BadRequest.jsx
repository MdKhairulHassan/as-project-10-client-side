import { CircleAlert } from 'lucide-react';
import { useNavigate } from 'react-router';

const BadRequest = ({
  message = 'The server could not process this request.',
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-base-300 rounded-3xl shadow-xl border border-warning/20 px-10 py-8 max-w-lg text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
          <CircleAlert size={34} />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-warning">Bad Request</h2>

        <p className="mt-3 text-lg text-base-content/80">
          We could not complete your request.
        </p>

        <p className="mt-4 text-sm leading-7 text-base-content/60 px-4">
          {message}
        </p>

        <div className="divider my-6" />

        <p className="text-sm text-base-content/60">
          Check the information you entered, then try again.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-warning"
          >
            Go Back
          </button>

          <button
            onClick={() => window.location.reload()}
            className="btn bg-linear-to-r from-violet-600 to-fuchsia-500 border-0 text-white hover:scale-105 transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadRequest;

import { WifiOff } from 'lucide-react';

const ReconnectServer = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 px-10 py-8 max-w-md text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500 flex items-center justify-center text-white animate-pulse">
          <WifiOff size={32} />
        </div>

        <h3 className="mt-6 text-2xl font-bold text-base-content">
          Connection Lost
        </h3>

        <p className="mt-3 text-base-content/70 text-lg">
          Trying to reconnect to the server...
        </p>
        <p className="mt-3 text-base-content/50 text-sm px-10">
          The server is not responding. Please wait for the server's response.
          You can refresh the website after a few minutes. If it still doesn't
          work and shows "connection lost," please leave this website and try
          later.
        </p>

        <div className="loading loading-spinner loading-lg text-primary mt-6"></div>
      </div>
    </div>
  );
};

export default ReconnectServer;

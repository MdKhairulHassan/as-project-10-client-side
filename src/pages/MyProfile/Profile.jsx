import { Mail, User } from 'lucide-react';
import { use } from 'react';
// import { AuthContext } from '../../provider/AuthProvider';
import { Link } from 'react-router';
import { AuthContext } from '../../provider/AuthContext';
import { ThemeContext } from '../../provider/ThemeContext';

const Profile = () => {
  const { user } = use(AuthContext);
  const { theme } = use(ThemeContext);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-30 ${theme === 'dark' ? 'bg-base-100' : 'bg-linear-to-br from-[#72CFE7]/20 via-[#fbc3f1]/20 to-[#fbe4c2]/40'}`}
    >
      <div
        className={`w-full max-w-md shadow-2xl rounded-3xl p-8 ${theme === 'dark' ? 'bg-base-300' : 'bg-white '}`}
      >
        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#5c23be]">My Profile</h2>

          <p className="text-gray-500 mt-2">Manage your personal information</p>
        </div>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={user && user.photoURL}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-[#72CFE7]"
            />

            {/* CAMERA ICON */}
            {/* <button className="absolute bottom-1 right-1 bg-[#10B981] p-2 rounded-full text-white shadow-md hover:scale-105 transition">
              <Camera size={18} />
            </button> */}
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="space-y-5">
          {/* NAME */}
          <div
            className={`rounded-xl p-4 flex items-center gap-4 ${theme === 'dark' ? 'bg-base-100' : 'bg-[#f9f9f9]'}`}
          >
            <div
              className={`p-3 rounded-full ${theme === 'dark' ? 'bg-[#72CFE7]' : 'bg-[#72CFE7]/20'}`}
            >
              <User className="text-[#5c23be]" size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Name</p>
              <h4
                className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
              >
                {user && user.displayName}
              </h4>
            </div>
          </div>

          {/* EMAIL */}
          <div
            className={`rounded-xl p-4 flex items-center gap-4 ${theme === 'dark' ? 'bg-base-100' : 'bg-[#f9f9f9]'}`}
          >
            <div
              className={`p-3 rounded-full ${theme === 'dark' ? 'bg-[#72CFE7]' : 'bg-[#fbc3f1]/30'}`}
            >
              <Mail className="text-[#5c23be]" size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <h4
                className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
              >
                {user && user.email}
              </h4>
            </div>
          </div>

          {/* UPDATE BUTTON */}
          <Link
            to={'/myprofile/updateprofile'}
            className="btn w-full mt-4 bg-[#5c23be] hover:bg-[#4c1ea1] border-none text-white text-base"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;

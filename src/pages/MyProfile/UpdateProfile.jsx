// import { use } from 'react';
// import { AuthContext } from '../../provider/AuthProvider';
// import { AuthContext } from '../../provider/AuthContext';
// import { ThemeContext } from '../../provider/ThemeContext';
import { User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import AxiosUseAuthProvider from '../../provider/AxiosUseAuthProvider';
// import { Mail, User } from 'lucide-react';

const UpdateProfile = () => {
  // const { user, setUser, updateUser } = use(AuthContext);
  // const { theme } = use(ThemeContext);
  const [{ user, setUser, updateUser }, { theme }] = AxiosUseAuthProvider();

  const navigate = useNavigate();

  // ===================================================== Need email varification to update or change the email.
  // const handleUpdateProfile = e => {
  //   e.preventDefault();

  //   const form = e.target;

  //   const name = form.name.value;
  //   const photo = form.photo.value;
  //   const email = form.email.value;

  //   updateUser({
  //     displayName: name,
  //     photoURL: photo,
  //   })
  //     .then(() => {
  //       return updateUserEmail(email);
  //     })
  //     .then(() => {
  //       setUser({
  //         ...user,
  //         displayName: name,
  //         photoURL: photo,
  //         email: email,
  //       });

  //       form.reset();

  //       console.log('Profile Updated Successfully');
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // };

  // ============================================================================================
  // const handleUpdateProfile = e => {
  //   e.preventDefault();

  //   const form = e.target;
  //   const name = form.name.value;
  //   const photo = form.photo.value;
  //   // const email = form.email.value;

  //   updateUser({
  //     displayName: name,
  //     photoURL: photo,
  //   })
  //     .then(() => {
  //       setUser({
  //         ...user,
  //         displayName: name,
  //         photoURL: photo,
  //       });

  //       form.reset();

  //       toast.success('Profile update successfully', {
  //         theme: 'colored',
  //       });
  //       navigate('/myprofile/profile');
  //     })
  //     .catch(error => {
  //       toast.error(error, {
  //         theme: 'colored',
  //       });
  //       setUser(user);
  //     });
  // };

  // ============================================================================================
  const handleUpdateProfile = async e => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const photo = form.photo.value.trim();

    try {
      await updateUser({
        displayName: name,
        photoURL: photo,
      });

      // Refreshes the real Firebase User object.
      await user.reload();

      // Do NOT use: setUser({ ...user, ... })
      // Keep the actual Firebase User instance.
      setUser(user);

      form.reset();

      toast.success('Profile updated successfully.', {
        theme: theme,
      });

      navigate('/myprofile/profile');
    } catch (error) {
      console.error('Profile update failed:', error);

      toast.error(error.message, {
        theme: theme,
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-30 ${theme === 'dark' ? 'bg-base-100' : 'bg-linear-to-br from-[#72CFE7]/20 via-[#fbc3f1]/20 to-[#fbe4c2]/40'}`}
    >
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl p-8 ${theme === 'dark' ? 'bg-base-300' : 'bg-white'}`}
      >
        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#5c23be]">Update Profile</h2>

          <p className="text-gray-500 mt-2">Edit your personal information</p>
        </div>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img
              src={user?.photoURL || 'https://i.ibb.co.com/2kR7z0h/user.png'}
              alt="profile"
              className="w-28 h-28 rounded-full border-2 border-[#72CFE7] object-cover"
            />

            {/* <div className="absolute bottom-1 right-1 bg-[#10B981] p-2 rounded-full text-white shadow-md">
              <Camera size={18} />
            </div> */}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          {/* NAME */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-gray-700">Name</span>
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="name"
                // defaultValue={user?.displayName}
                placeholder={user?.displayName}
                className="input input-bordered w-full pl-3 focus:outline-none focus:border-[#5c23be]"
                required
              />
            </div>
          </div>

          {/* PHOTO URL */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-gray-700">
                Photo URL
              </span>
            </label>

            <input
              type="text"
              name="photo"
              // defaultValue={user?.photoURL}
              placeholder={user?.photoURL}
              className="input input-bordered w-full focus:outline-none focus:border-[#5c23be]"
              required
            />
          </div>

          {/* EMAIL */}
          {/* <div>
            <label className="label">
              <span className="label-text font-medium text-gray-700">
                Email Address
              </span>
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                defaultValue={user?.email}
                readOnly
                className="input input-bordered w-full pl-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div> */}

          {/* BUTTON */}
          <button className="btn w-full mt-4 bg-[#5c23be] hover:bg-[#4a1ea3] border-none text-white text-base">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;

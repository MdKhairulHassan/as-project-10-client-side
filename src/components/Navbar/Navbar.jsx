import { BsBarChartLineFill } from 'react-icons/bs';
import { ImProfile } from 'react-icons/im';
import { NavLink } from 'react-router';
import Logo from '../../assets/Logo.png';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { RiHome4Line } from 'react-icons/ri';
// import { use } from 'react';
// import { AuthContext } from '../../provider/AuthProvider';
import {
  MdDarkMode,
  MdLightMode,
  MdLogin,
  MdLogout,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
// import { AuthContext } from '../../provider/AuthContext';
// import { ThemeContext } from '../../provider/ThemeContext';
// import { UserPen } from 'lucide-react';
import AxiosUseAuthProvider from '../../provider/AxiosUseAuthProvider';

const Navbar = () => {
  // const { user, logOut } = use(AuthContext);
  // const { theme, toggleTheme } = use(ThemeContext);
  const [{ user, logOut }, { theme, toggleTheme }] = AxiosUseAuthProvider();

  const handleLogOut = () => {
    console.log('user trying to logout');
    logOut()
      .then(() => {
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

  const links = (
    <>
      <li>
        <NavLink
          to={'/'}
          className={
            'flex flex-col hover:bg-[#c09cff86] [&.active]:bg-[#98ffdd]'
          }
        >
          <RiHome4Line className="text-lg text-primary" />
          <span className="text-[0.70rem] text-secondary">Home</span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={'/addTransactions'}
          className={
            'flex flex-col hover:bg-[#c09cff86] [&.active]:bg-[#98ffdd]'
          }
        >
          <IoMdAddCircleOutline className="text-lg text-primary" />
          <span className="text-[0.70rem] text-secondary ">
            Add Transactions
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={'/allTransactions'}
          className={
            'flex flex-col hover:bg-[#c09cff86] [&.active]:bg-[#98ffdd]'
          }
        >
          <ImProfile className="text-lg text-primary" />
          <span className="text-[0.70rem] text-secondary ">
            My Transactions
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink
          to={'/reports'}
          className={
            'flex flex-col hover:bg-[#c09cff86] [&.active]:bg-[#98ffdd]'
          }
        >
          <BsBarChartLineFill className="text-lg text-primary" />
          <span className="text-[0.70rem] text-secondary">Reports</span>
        </NavLink>
      </li>
      <li>
        {user && (
          <NavLink
            to={'/myprofile/profile'}
            className={
              'flex flex-col hover:bg-[#c09cff86] [&.active]:bg-[#98ffdd]'
            }
          >
            <MdOutlineManageAccounts className="text-lg text-primary" />
            <span className="text-[0.70rem] text-secondary ">My Profile</span>
          </NavLink>
        )}
      </li>
      <li>
        {/* <button
          onClick={toggleTheme}
          className={`flex flex-col hover:bg-[#c09cff86]`}
        >
          {theme === 'light' ? (
            <MdDarkMode className="text-lg text-primary" />
          ) : (
            <MdLightMode className="text-lg text-[#98ffdd]" />
          )}
          <span className="text-[0.70rem] text-secondary ">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button> */}

        <label className="flex cursor-pointer gap-2 ml-10 hover:bg-[#c09cff86]">
          <MdLightMode
            className={`text-lg ${theme === 'light' ? 'text-yellow-500' : 'text-primary'}`}
          />
          {/* <input
            onClick={toggleTheme}
            type="checkbox"
            value="synthwave"
            className="toggle theme-controller bg-[#98ffdd] hover:bg-[#c09cff86]"
          /> */}
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="toggle bg-[#98ffdd] hover:bg-[#c09cff86]"
            aria-label="Toggle dark mode"
          />
          <MdDarkMode
            className={`text-lg ${theme === 'light' ? 'text-primary' : 'text-[#98ffdd]'}`}
          />
        </label>
      </li>
    </>
  );

  return (
    <div
      className={`${theme === 'dark' ? 'bg-base-300' : 'bg-linear-to-br from-sky-200 via-indigo-50 to-violet-200'}`}
    >
      <div className="max-lg:collapse rounded-md w-full">
        <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
        <label
          htmlFor="navbar-1-toggle"
          className="fixed inset-0 hidden max-lg:peer-checked:block"
        ></label>
        <div className="collapse-title navbar">
          <div className="navbar-start">
            <label
              htmlFor="navbar-1-toggle"
              className="btn btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <NavLink
              to={'/'}
              className="btn btn-ghost text-xl hover:bg-[#c09cff86] px-3 py-8 rounded-2xl"
            >
              <img src={Logo} alt="Logo" className="w-18" />
              <div className="flex">
                <span className="text-[#3B1E6D]">Fin</span>
                <span className="text-[#10B981]">Ease</span>
              </div>
            </NavLink>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal items-center px-1">{links}</ul>
          </div>
          <div className="navbar-end gap-x-5">
            <NavLink
              to={'/myprofile/profile'}
              className={
                'hover:bg-[#c09cff86] [&.active]:bg-[#98ffdd] px-1 py-1 rounded-full'
              }
            >
              {user ? (
                <img
                  src={user.photoURL}
                  alt="photo"
                  className="w-14 h-14 rounded-full"
                />
              ) : (
                <FaRegUserCircle className="text-4xl text-primary" />
              )}
            </NavLink>
            <ol>
              {user ? (
                <NavLink
                  onClick={handleLogOut}
                  className="text-[1rem] flex items-center gap-1 hover:bg-[#c09cff86] px-2 py-1 rounded-2xl"
                >
                  <p className="text-secondary">
                    Log<span className="text-primary">out</span>
                  </p>
                  <MdLogout className="text-primary" />
                </NavLink>
              ) : (
                <NavLink
                  to={'/auth/login'}
                  className={
                    'text-[1rem] flex items-center gap-1 hover:bg-[#c09cff86] [&.active]:bg-[#98ffdd] px-2 py-1 rounded-2xl'
                  }
                >
                  <p className="text-primary">
                    Log<span className="text-secondary">in</span>
                  </p>
                  <MdLogin className="text-secondary" />
                </NavLink>
              )}
            </ol>
          </div>
        </div>

        <div className="collapse-content lg:hidden z-1">
          <ul className="menu">{links}</ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

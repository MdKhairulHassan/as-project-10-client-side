import { FcGoogle } from 'react-icons/fc';
import Logo from '../../assets/Logo.png';
import LoginImage from '../../assets/login-image.png';
import { Link, useLocation, useNavigate } from 'react-router';
import { use, useEffect, useState } from 'react';
// import { AuthContext } from '../../provider/AuthProvider';
import { FaRegEye } from 'react-icons/fa';
import { LuEyeClosed } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { AuthContext } from '../../provider/AuthContext';
import { ThemeContext } from '../../provider/ThemeContext';

const Login = () => {
  const { logIn, googleSignIn } = use(AuthContext);
  const { theme } = use(ThemeContext);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();

  useEffect(() => {
    if (location?.state?.message) {
      toast.info(location.state.message, {
        toastId: 'private-route-warning',
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme,
      });
    }
  }, [location, theme]);

  const handleLogIn = e => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const form = e.target;
    const email = form.email.value;

    // for email requirement
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    const password = form.password.value;

    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;
    // passwordRegex.test('Abcdef1!'); // true. but old regex vs code giving unnecessary escape alert

    // must need symbol
    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;

    // for password requirement
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    // passwordRegex pattern example: ('ABCdef123+?*'); // true
    // for password requirement
    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    console.log(email, password);

    logIn(email, password)
      .then(() => {
        // .then((result) => {
        // Signed in
        // const user = result.user;
        // console.log(user);
        // })
        setSuccess(true);

        toast.success('Login successfully', {
          theme: theme,
        });
        navigate(`${location?.state?.from ? location?.state?.from : '/'}`);
        // setTimeout(() => {
        //   // navigate(`${location.state ? location.state : '/'}`);
        // }, 2000);
        form.reset();
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorCode);
        toast.error(errorMessage, {
          theme: theme,
        });
        // alert(errorMessage, errorCode);
      });
  };

  const handleGoogleSignIn = () => {
    setError('');
    setSuccess(false);
    // console.log('google button clicked');
    googleSignIn()
      .then(() => {
        setSuccess(true);
        toast.success('Login successfully', {
          theme: theme,
        });
        navigate(`${location?.state?.from ? location?.state?.from : '/'}`);
        // setTimeout(() => {
        // }, 2000);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorCode);
        toast.error(errorMessage, {
          theme: theme,
        });
        // alert(errorMessage, errorCode);
      });
    // .then(result => {
    //   const user = result.user;
    //   console.log(user);
    // })
    // .catch(error => {
    //   const err = error;
    //   console.log(err);
    // });
  };

  const handleTogglePasswordShow = e => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen px-4 py-40 ${theme === 'dark' ? 'bg-base-100' : 'bg-linear-to-br from-[#72CFE7]/30 via-[#fbc3f1]/20 to-[#fbe4c2]'}`}
    >
      <div className="max-w-11/12 w-full grid md:grid-cols-2 items-center gap-12">
        {/* LEFT SIDE IMAGE */}
        <div className="hidden md:flex justify-center">
          <img
            src={LoginImage}
            alt="finance illustration"
            className="w-105 rounded-2xl"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="max-w-md w-full mx-auto">
          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 w-20">
              <img src={Logo} alt="" />
            </div>
          </div>

          {/* TITLE */}
          <h2
            className={`text-3xl font-semibold text-center mb-8 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
          >
            Welcome back to FinEase
          </h2>

          {/* FORM */}
          <form onSubmit={handleLogIn} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="label">
                <span className="label-text text-gray-700">Email Address</span>
              </label>

              <input
                name="email"
                type="email"
                placeholder="abc@gmail.com"
                className="input input-bordered w-full focus:outline-none focus:border-[#3563E9]"
                required
              />
              {emailError && (
                <p className={'text-xs text-error mt-1 ml-1'}>
                  Email is not valid
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="label">
                <span className="label-text text-gray-700">Password</span>
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={`${showPassword ? 'text' : 'password'}`}
                  placeholder="••••••••"
                  className="input input-bordered w-full focus:outline-none focus:border-[#3563E9]"
                  required
                />
                <button
                  className="p-2 cursor-pointer btn-xs absolute top-1 right-2"
                  onClick={handleTogglePasswordShow}
                >
                  {showPassword ? <FaRegEye /> : <LuEyeClosed />}
                </button>
              </div>

              {passwordError && (
                <p className={'text-xs text-error mt-1 ml-1'}>
                  Must have an Uppercase, Lowercase letter and Length must be at
                  least 6 character
                </p>
              )}
            </div>

            {error && <p className="text-error text-xs mt-1 ml-1">{error}</p>}

            {success && (
              <p className="text-success text-xs mt-1 ml-1">Login success</p>
            )}

            {/* LOGIN BUTTON */}
            <button className="btn w-full bg-[#3563E9] hover:bg-[#2954d4] text-white border-none">
              LOGIN
            </button>

            {/* DIVIDER */}
            <div className="divider text-gray-400 text-sm">OR</div>

            {/* GOOGLE BUTTON */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="btn btn-outline w-full border-[#3563E9] text-[#3563E9] hover:bg-[#3563E9] hover:text-white"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            {/* SIGNUP */}
            <p className="text-center text-sm text-gray-500">
              New to FinEase?{' '}
              <Link
                state={location.state}
                to={'/auth/register'}
                className="text-[#3563E9] font-medium"
              >
                Signup
              </Link>
            </p>

            {/* <ToastContainer /> */}

            {/* FOOTER TEXT */}
            {/* <p className="text-center text-xs text-gray-400 mt-4">
              🔒 Your data is encrypted and never shared without your consent.
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

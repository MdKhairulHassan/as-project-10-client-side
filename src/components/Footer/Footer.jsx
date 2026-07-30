import { FaFacebookF, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { Link } from 'react-router';
import Logo from '../../assets/Logo.png';
import { use, useRef } from 'react';
import { ThemeContext } from '../../provider/ThemeContext';
// import { HashLink } from 'react-router-hash-link';

const Footer = () => {
  const { theme } = use(ThemeContext);
  // const handleScroll = () => {
  //   document.getElementById('Branding')?.scrollIntoView({
  //     behavior: 'smooth',
  //   });
  // };

  const termsOfUse = useRef(null);

  const termsOfUseModalOpen = () => {
    termsOfUse.current.showModal();
  };

  const privacyPolicy = useRef(null);

  const privacyPolicyModalOpen = () => {
    privacyPolicy.current.showModal();
  };

  const cookiePolicy = useRef(null);

  const cookiePolicyModalOpen = () => {
    cookiePolicy.current.showModal();
  };

  return (
    <div>
      <footer
        className={`footer sm:footer-horizontal text-base-content p-10 ${theme === 'dark' ? 'bg-base-300' : 'bg-linear-to-br from-sky-200 via-indigo-50 to-violet-200'}`}
      >
        <nav>
          <h6 className="footer-title">Services</h6>
          {/* <button onClick={handleScroll} className="link link-hover">
            Branding
          </button> */}
          {/* <a href="/#Branding" className="link link-hover">
            Branding
          </a> */}
          {/* <HashLink smooth to="/#Branding" className="link link-hover">
            Branding
          </HashLink> */}

          <Link to={'/#branding'} className="link link-hover">
            Branding
          </Link>
          <Link to={'/#financial_overview'} className="link link-hover">
            Financial Calculation
          </Link>
          <Link to={'/#budgeting'} className="link link-hover">
            Budgeting
          </Link>
          <Link to={'/#planning'} className="link link-hover">
            Planning
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a
            href="https://github.com/MdKhairulHassan"
            target="_blank"
            className="link link-hover"
          >
            About us
          </a>
          <a
            href="mailto:darknessmoon76@gmail.com?subject=FinEase%20Contact&body=Hello%20there,"
            target="_blank"
            className="link link-hover"
          >
            Contact
          </a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <button onClick={termsOfUseModalOpen} className="link link-hover">
            Terms of use
          </button>
          <button onClick={privacyPolicyModalOpen} className="link link-hover">
            Privacy policy
          </button>
          <button onClick={cookiePolicyModalOpen} className="link link-hover">
            Cookie policy
          </button>
        </nav>
      </footer>
      <footer
        className={`footer text-base-content border-base-300 border-t px-10 py-4 ${theme === 'dark' ? 'bg-base-100' : 'bg-linear-to-br from-sky-200 via-indigo-50 to-violet-200'}`}
      >
        <div className="">
          <Link
            to={'/'}
            className="btn btn-ghost text-xl hover:bg-[#c09cff86] pt-8 pb-7 pr-13 pl-7 rounded-2xl w-40"
          >
            <img src={Logo} alt="Logo" className="w-18" />
            <div className="flex">
              <span className="text-[#3B1E6D]">Fin</span>
              <span className="text-[#10B981]">Ease</span>
            </div>
          </Link>
          <p>
            FinEase Industries Ltd.
            <br />
            Providing reliable tech since 2026
          </p>
        </div>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="flex items-center gap-4">
            <a href="https://x.com/" target="_blank">
              <FaXTwitter className="w-7 h-6" />
            </a>
            <a href="https://www.youtube.com/" target="_blank">
              <FaYoutube className="w-7 h-6" />
            </a>
            <a href="https://www.facebook.com/" target="_blank">
              <FaFacebookF className="w-7 h-6" />
            </a>
          </div>
        </nav>
        <dialog ref={termsOfUse} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box p-0">
            <div className="h-2 bg-linear-to-r from-violet-600 via-fuchsia-500 to-blue-500"></div>
            <div className="p-5">
              <h3 className="font-bold text-lg">Terms of use!</h3>
              <p className="py-4">
                Still, no terms of use are applied here. Please check it out
                later.
                <br />
                <br />
                Press the ESC key or click the button below or click outside to
                close.
              </p>
              <div className="modal-action mt-0">
                <button
                  className="btn"
                  onClick={() => {
                    // handleCancel();
                    termsOfUse.current.close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog
          ref={privacyPolicy}
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box p-0">
            <div className="h-2 bg-linear-to-r from-violet-600 via-fuchsia-500 to-blue-500"></div>
            <div className="p-5">
              <h3 className="font-bold text-lg">Privacy policy!</h3>
              <p className="py-4">
                Still, no privacy policy is applied here. Please check it out
                later.
                <br />
                <br />
                Press the ESC key or click the button below or click outside to
                close.
              </p>
              <div className="modal-action mt-0">
                <button
                  className="btn"
                  onClick={() => {
                    // handleCancel();
                    privacyPolicy.current.close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog
          ref={cookiePolicy}
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="modal-box p-0">
            <div className="h-2 bg-linear-to-r from-violet-600 via-fuchsia-500 to-blue-500"></div>
            <div className="p-5">
              <h3 className="font-bold text-lg">Cookie policy!</h3>
              <p className="py-4">
                Still, no cookie policy is applied here. Please check it out
                later.
                <br />
                <br />
                Press the ESC key or click the button below or click outside to
                close.
              </p>
              <div className="modal-action mt-0">
                <button
                  className="btn"
                  onClick={() => {
                    // handleCancel();
                    cookiePolicy.current.close();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </footer>
    </div>
  );
};

export default Footer;

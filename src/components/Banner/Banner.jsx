import { ArrowRight } from 'lucide-react';
import { use, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import bannerImage from '../../assets/login-image.png';
import { ThemeContext } from '../../provider/ThemeContext';

const Banner = () => {
  const location = useLocation();
  const { theme } = use(ThemeContext);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');

      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <section
      className={`py-20 ${theme === 'dark' ? 'bg-base-100' : 'bg-linear-to-br from-sky-100 via-indigo-50 to-violet-100'}`}
      id="branding"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-12">
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#5c23be] leading-tight">
            Smart finance starts here—track, save, and grow with ease.
          </h1>

          <p className="mt-5 text-gray-600 text-lg">
            Take control of your income, expenses, and savings goals with
            FinEase. Visualize your finances, stay on budget, and build a secure
            future—one step at a time.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4">
            <Link
              to={'/addTransactions'}
              className="btn bg-[#5c23be] text-white hover:bg-[#4a1ea3] border-none"
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Glow Background */}
            <div className="absolute inset-0 bg-linear-to-tr from-[#5c23be]/30 to-[#10B981]/30 blur-3xl rounded-full"></div>

            {/* Image Card */}
            <div className="relative bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-xl">
              <img
                src={bannerImage}
                alt="finance dashboard"
                className="w-[320px] md:w-96 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

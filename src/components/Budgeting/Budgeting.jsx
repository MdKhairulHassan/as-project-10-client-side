import { use, useEffect } from 'react';
import { useLocation } from 'react-router';
import { ThemeContext } from '../../provider/ThemeContext';

const Budgeting = () => {
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
      id="budgeting"
      className={`py-16 my-30 rounded-2xl ${theme === 'dark' ? 'bg-base-300' : 'bg-linear-to-br from-sky-200 via-indigo-50 to-violet-200'}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#5c23be]">
            Smart Budgeting, Better Tomorrow
          </h2>
          <p className="text-gray-600 mt-3">
            Manage your money wisely with simple and effective budgeting habits.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card bg-[#72CFE7]/30 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-[#72CFE7] text-white text-xl">
                💰
              </div>
              <h3
                className={`font-semibold mt-2  ${
                  theme === 'dark' ? 'text-white' : 'text-[#5c23be]'
                } `}
              >
                Track Spending
              </h3>
              <p className="text-sm text-gray-500">
                Know where your money goes.
              </p>
            </div>
          </div>

          <div className="card bg-[#72CFE7]/30 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-[#fbe4c2] text-white text-xl">
                🎯
              </div>
              <h3
                className={`font-semibold mt-2  ${
                  theme === 'dark' ? 'text-white' : 'text-[#5c23be]'
                } `}
              >
                Set Goals
              </h3>
              <p className="text-sm text-gray-500">
                Plan short & long-term targets.
              </p>
            </div>
          </div>
          <div className="card bg-[#72CFE7]/30 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-[#fbc3f1] text-white text-xl">
                💡
              </div>
              <h3
                className={`font-semibold mt-2  ${
                  theme === 'dark' ? 'text-white' : 'text-[#5c23be]'
                } `}
              >
                Save Smartly
              </h3>
              <p className="text-sm text-gray-500">Save a portion regularly.</p>
            </div>
          </div>

          <div className="card bg-[#72CFE7]/30 shadow-md hover:shadow-xl transition">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-[#72CFE7] text-white text-xl">
                📊
              </div>
              <h3
                className={`font-semibold mt-2  ${
                  theme === 'dark' ? 'text-white' : 'text-[#5c23be]'
                } `}
              >
                Review Budget
              </h3>
              <p className="text-sm text-gray-500">
                Adjust and improve monthly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Budgeting;

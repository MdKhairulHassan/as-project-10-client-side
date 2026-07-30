import { Target, ShieldCheck, Wallet, HeartHandshake } from 'lucide-react';
import { use, useEffect } from 'react';
import { useLocation } from 'react-router';
import { ThemeContext } from '../../provider/ThemeContext';

const FinancialPlanning = () => {
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
      id="planning"
      className={`py-20 mt-30 mb-10 rounded-2xl ${theme === 'dark' ? 'bg-base-100' : 'bg-linear-to-br from-sky-200 via-indigo-50 to-violet-200'}`}
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-4xl font-bold text-[#5c23be] mb-4">
            Why Financial Planning Matters
          </h2>

          <p className="text-gray-600 mb-8">
            Take control of your finances today to build a secure, stress-free
            tomorrow. Smart planning helps you stay prepared and grow with
            confidence.
          </p>

          <div className="grid grid-cols-2 gap-5">
            {/* Item 1 */}
            <div
              className={`${theme === 'dark' ? 'bg-base-300' : 'bg-white'} p-5 rounded-2xl shadow hover:shadow-lg transition`}
            >
              <Target className="text-[#10B981] mb-2" size={28} />
              <h4 className="font-semibold text-[#5c23be]">Achieve Goals</h4>
              <p className="text-sm text-gray-500">
                Turn your dreams into actionable plans.
              </p>
            </div>

            {/* Item 2 */}
            <div
              className={`${theme === 'dark' ? 'bg-base-300' : 'bg-white'} p-5 rounded-2xl shadow hover:shadow-lg transition`}
            >
              <ShieldCheck className="text-[#72CFE7] mb-2" size={28} />
              <h4 className="font-semibold text-[#5c23be]">Be Prepared</h4>
              <p className="text-sm text-gray-500">
                Stay ready for unexpected situations.
              </p>
            </div>

            {/* Item 3 */}
            <div
              className={`${theme === 'dark' ? 'bg-base-300' : 'bg-white'} p-5 rounded-2xl shadow hover:shadow-lg transition`}
            >
              <Wallet className="text-[#fbc3f1] mb-2" size={28} />
              <h4 className="font-semibold text-[#5c23be]">Build Wealth</h4>
              <p className="text-sm text-gray-500">
                Grow your savings and investments.
              </p>
            </div>

            {/* Item 4 */}
            <div
              className={`${theme === 'dark' ? 'bg-base-300' : 'bg-white'} p-5 rounded-2xl shadow hover:shadow-lg transition`}
            >
              <HeartHandshake className="text-[#10B981] mb-2" size={28} />
              <h4 className="font-semibold text-[#5c23be]">Reduce Stress</h4>
              <p className="text-sm text-gray-500">
                Feel confident about your future.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-linear-to-tr from-[#5c23be]/30 to-[#10B981]/30 blur-3xl rounded-full"></div>

            {/* Image Card */}
            <div className="relative bg-white/70 backdrop-blur-lg p-6 rounded-3xl shadow-xl">
              <img
                src="https://img.freepik.com/free-vector/financial-management-concept-illustration_114360-1013.jpg"
                alt="financial planning"
                className="w-[320px] md:w-96 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialPlanning;

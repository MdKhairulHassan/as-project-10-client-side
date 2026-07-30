import { use, useEffect } from 'react';
import { GiExpense, GiMoneyStack } from 'react-icons/gi';
import { MdAccountBalance } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { useLocation } from 'react-router';
import { ThemeContext } from '../../provider/ThemeContext';
// import { Link } from 'react-router';

const FinancialBalance = ({ totalBalance, totalIncome, totalExpense }) => {
  // const { amount: tAmount } = totalBalance;
  // const { amount: iAmount } = incomeData;
  // const { _id: i_id } = incomeData;
  // const { amount: eAmount } = expenses;

  const { theme } = use(ThemeContext);

  const location = useLocation();

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
    <div id="financial_overview">
      <div className="text-center my-12">
        <h2 className="text-4xl font-bold text-[#5c23be]">
          Your Financial Overview
        </h2>
        <p className="text-gray-600 mt-3">
          Observe your financial overview everday.
        </p>
      </div>

      <div className="flex justify-center gap-x-6">
        <div
          className={`w-110 h-105 rounded-2xl ${theme === 'dark' ? 'bg-base-300' : 'bg-linear-to-br from-[#6b96e5] via-[#83abf5] to-[#5f86d0]'}`}
        >
          <p className="px-5 py-10 text-white font-semibold text-2xl">
            Total Balance
          </p>
          <div className="">
            <MdAccountBalance className="text-9xl text-[#ffffffb2] ml-5" />
          </div>
          <div className="flex justify-between px-7 items-center">
            <div className="mt-5 flex flex-col gap-y-3">
              <div className="flex items-center gap-x-2">
                <p
                  className={`font-bold text-2xl ${
                    totalBalance < 0 ? 'text-red-500' : 'text-white'
                  }`}
                >
                  $ {totalBalance ?? '00 - N/A'}
                </p>
                <p className="font-bold text-white text-2xl">Balance</p>
              </div>
              {totalBalance === null || totalBalance === undefined ? (
                <p className="font-bold text-red-600 text-sm px-3 py-2 bg-violet-400 rounded-2xl">
                  Balance transactions data not found.
                </p>
              ) : null}

              {totalBalance === 0 ? (
                <p className="font-bold text-violet-700 text-sm px-3 py-2 bg-violet-400 rounded-2xl">
                  You have no balance. Need more income transactions.
                </p>
              ) : null}
              {totalBalance < 0 ? (
                <p className="font-bold text-violet-700 text-sm px-3 py-2 bg-violet-400 rounded-2xl">
                  Your expenses are higher than your balance. Need more income
                  transactions.
                </p>
              ) : null}
              <p className="font-bold text-white text-lg">Current Balance</p>
            </div>
            <RiMoneyDollarCircleFill className="text-8xl text-[#3b3b3bc1] mt-10" />
          </div>
        </div>

        <div
          className={` w-80 h-105 rounded-2xl ${theme === 'dark' ? 'bg-base-300' : 'bg-linear-to-br from-[#55d39d] via-[#60e2aa] to-[#3ea478'}`}
        >
          <p
            className={`px-5 py-10 font-semibold text-2xl ${
              theme === 'dark' ? 'text-white' : 'text-[#3b3b3b]'
            }`}
          >
            Total Income
          </p>
          <div className="">
            <GiMoneyStack className="text-9xl text-[#ffffffb2] ml-5" />
          </div>
          <div className="flex justify-between px-7 items-center">
            <div
              className={`flex flex-col gap-y-3 ${totalIncome === null || totalIncome === undefined || totalIncome === 0 ? 'mt-5' : 'mt-10'}`}
            >
              <div className="flex items-center gap-x-2">
                <p
                  className={`font-bold text-2xl ${
                    totalIncome < 0
                      ? 'text-red-500'
                      : theme === 'dark'
                        ? 'text-white'
                        : 'text-[#3b3b3b]'
                  }`}
                >
                  $ {totalIncome ?? '00 - N/A'}
                </p>
                <p
                  className={`font-bold text-2xl ${
                    theme === 'dark' ? 'text-white' : 'text-[#3b3b3b]'
                  }`}
                >
                  Income
                </p>
              </div>
              {totalIncome === null || totalIncome === undefined ? (
                <p className="font-bold text-red-600 text-sm px-3 py-2 bg-violet-400 rounded-2xl">
                  Income transactions data not found.
                </p>
              ) : null}

              {totalIncome === 0 ? (
                <p className="font-bold text-violet-700 text-sm px-3 py-2 bg-violet-400 rounded-2xl">
                  Your income is zero. Need income transactions.
                </p>
              ) : null}

              <p
                className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-white' : 'text-[#3b3b3b]'
                }`}
              >
                Current Income
              </p>
              {/* <div className="mt-2">
                <Link
                  // to={`/updateOrDetailsIncome/${i_id}`}
                  className="font-extrabold text-[#000000] text-sm hover:bg-[#ff7ce7] bg-[#ab7bff86] px-4 py-1 rounded-2xl"
                >
                  Update/Details Of Income
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        <div
          className={`w-80 h-105 rounded-2xl ${theme === 'dark' ? 'bg-base-300' : 'bg-linear-to-br from-[#b6a4fee7] via-[#c8baffe7] to-[#b6a3ffe7]'}`}
        >
          <p
            className={`px-5 py-10 font-semibold text-2xl  ${
              theme === 'dark' ? 'text-white' : 'text-[#3b3b3b]'
            }`}
          >
            Total Expenses
          </p>
          <div className="">
            <GiExpense className="text-9xl text-[#ffffffb2] ml-5" />
          </div>
          <div className="flex justify-between px-7 items-center">
            <div
              className={`flex flex-col gap-y-3 ${totalIncome === null || totalIncome === undefined || totalIncome === 0 ? 'mt-5' : 'mt-10'}`}
            >
              <div className="flex items-center gap-x-2">
                <p
                  className={`font-bold text-2xl ${
                    totalExpense < 0
                      ? 'text-red-500'
                      : theme === 'dark'
                        ? 'text-white'
                        : 'text-[#3b3b3b]'
                  }`}
                >
                  $ {totalExpense ?? '00 - N/A'}
                </p>
                <p
                  className={`font-bold text-2xl  ${
                    theme === 'dark' ? 'text-white' : 'text-[#3b3b3b]'
                  }`}
                >
                  Income
                </p>
              </div>
              {totalExpense === null || totalExpense === undefined ? (
                <p className="font-bold text-red-600 text-sm px-3 py-2 bg-violet-400 rounded-2xl">
                  Expense transactions data not found.
                </p>
              ) : null}

              {totalExpense === 0 ? (
                <p className="font-bold text-green-400 text-sm px-3 py-2 bg-green-200 rounded-2xl">
                  Your expenses are zero. Make expense transactions if you want.
                </p>
              ) : null}
              <p
                className={`font-bold text-lg  ${
                  theme === 'dark' ? 'text-white' : 'text-[#3b3b3b]'
                }`}
              >
                Current Expenses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialBalance;

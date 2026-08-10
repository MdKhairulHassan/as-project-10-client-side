// import { Line, LineChart } from 'recharts';

import { use, useEffect, useState } from 'react';
import ResultsChart from '../../components/ResultsChart/ResultsChart';
import { AuthContext } from '../../provider/AuthContext';
import { Link } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';
import { IoBarChart } from 'react-icons/io5';
import { ThemeContext } from '../../provider/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ReconnectServer from '../../components/ReconnectServer/ReconnectServer';
import UnauthorizedAccess from '../../components/UnauthorizedAccess/UnauthorizedAccess';
import ForbiddenAccess from '../../components/ForbiddenAccess/ForbiddenAccess';
import CategoryChart from '../../components/CategoryChart/CategoryChart';

const Reports = () => {
  const { user } = use(AuthContext);
  const { theme } = use(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  // const [category, setCategory] = useState('');
  const [category, setCategory] = useState(
    localStorage.getItem('filter') || 'type',
  );

  useEffect(() => {
    document.documentElement.setAttribute('transaction-type', category);
    localStorage.setItem('filter', category);
  }, [category]);

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // ===============================================================================================
  // useEffect(() => {
  //   if (!user?.email) {
  //     const loading = () => {
  //       setTransactions([]);
  //       setLoading(true);
  //       setTimeout(() => {
  //         setLoading(false);
  //       }, 2000);
  //     };
  //     loading();
  //     return;
  //   }

  //   let interval;

  //   const fetchBalance = async () => {
  //     try {
  //       const token = await user.getIdToken();
  //       const res = await fetch(
  //         `http://localhost:3000/transactions?email=${user.email}`,
  //         {
  //           headers: {
  //             authorization: `Bearer ${token}`,
  //           },
  //         },
  //       );

  //       if (res.status === 401) {
  //         setError('Unauthorized');
  //         setLoading(false);

  //         return 'unauthorized';
  //       }

  //       if (res.status === 403) {
  //         setError('Forbidden');
  //         setLoading(false);

  //         return 'forbidden';
  //       }

  //       if (res.status >= 500) {
  //         setLoading(false);
  //         return 'server';
  //       }

  //       // console.log(res);

  //       if (!res.ok) {
  //         throw new Error('Server Error');
  //       }

  //       const data = await res.json();

  //       setTransactions(data);
  //       setError('');
  //       setLoading(false);

  //       return true;
  //     } catch (err) {
  //       console.error(err);

  //       setError('Trying to reconnect');
  //       setLoading(false);

  //       return false;
  //     }
  //   };

  //   const load = async () => {
  //     const success = await fetchBalance();

  //     if (success === 'unauthorized' || success === 'forbidden') {
  //       return;
  //     }
  //     // if (success === 'forbidden') {
  //     //   return;
  //     // }

  //     // if (!success || success === 'server') {
  //     //   interval = setInterval(async () => {
  //     //     if (await fetchBalance()) {
  //     //       clearInterval(interval);
  //     //     }
  //     //   }, 3000);
  //     // }

  //     // ============== Retry only when server is down ======= option 2
  //     if (success === 'server' || !success) {
  //       interval = setInterval(async () => {
  //         const retry = await fetchBalance();

  //         if (
  //           retry === true ||
  //           retry === 'unauthorized' ||
  //           retry === 'forbidden'
  //         ) {
  //           clearInterval(interval);
  //         }
  //       }, 3000);
  //     }
  //   };

  //   load();

  //   return () => clearInterval(interval);
  // }, [user]);

  // ===============================================================================================
  useEffect(() => {
    if (!user?.email) {
      const loading = () => {
        setTransactions([]);
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
        }, 2000);
      };

      loading();
      return;
    }

    let cancelled = false;

    const MAX_RETRIES = 6;
    const BASE_DELAY = 2000;
    const MAX_DELAY = 60000;

    const fetchBalance = async () => {
      try {
        const token = await user.getIdToken();

        const res = await fetch(
          `http://localhost:3000/transactions?email=${user.email}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        // =====================================================
        // 401 = Invalid/expired authentication
        // NEVER retry
        // =====================================================
        if (res.status === 401) {
          setError('Unauthorized');
          setLoading(false);

          return 'unauthorized';
        }

        // =====================================================
        // 403 = Authenticated but forbidden
        // NEVER retry
        // =====================================================
        if (res.status === 403) {
          setError('Forbidden');
          setLoading(false);

          return 'forbidden';
        }

        // =====================================================
        // 500+ = Server problem
        // Retry with exponential backoff
        // =====================================================
        if (res.status >= 500) {
          setLoading(false);

          return 'server';
        }

        // =====================================================
        // Other HTTP errors
        // =====================================================
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();

        if (cancelled) {
          return true;
        }

        setTransactions(data);
        setError('');
        setLoading(false);

        return true;
      } catch (err) {
        if (cancelled) {
          return false;
        }

        console.error(err);

        setError('Trying to reconnect');
        setLoading(false);

        return 'network';
      }
    };

    const wait = ms => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    };

    const loadData = async () => {
      const firstAttempt = await fetchBalance();

      // =====================================================
      // Successful request
      // =====================================================
      if (firstAttempt === true) {
        return;
      }

      // =====================================================
      // Authentication problems
      // NEVER retry
      // =====================================================
      if (firstAttempt === 'unauthorized' || firstAttempt === 'forbidden') {
        return;
      }

      // =====================================================
      // Server/network problem
      // Start retry process
      // =====================================================
      for (let retryCount = 1; retryCount <= MAX_RETRIES; retryCount++) {
        if (cancelled) {
          return;
        }

        // Exponential backoff
        const exponentialDelay = Math.min(
          BASE_DELAY * 2 ** (retryCount - 1),
          MAX_DELAY,
        );

        // Jitter: random value between 0 and 1000 ms
        const jitter = Math.floor(Math.random() * 1000);

        const delay = exponentialDelay + jitter;

        console.log(`Retry ${retryCount}/${MAX_RETRIES} in ${delay}ms`);

        await wait(delay);

        if (cancelled) {
          return;
        }

        const result = await fetchBalance();

        // ===================================================
        // Success → STOP retrying
        // ===================================================
        if (result === true) {
          console.log('Server connection restored');
          return;
        }

        // ===================================================
        // 401 → STOP retrying
        // ===================================================
        if (result === 'unauthorized') {
          return;
        }

        // ===================================================
        // 403 → STOP retrying
        // ===================================================
        if (result === 'forbidden') {
          return;
        }

        // Otherwise continue retrying
      }

      // =====================================================
      // Maximum retry count reached
      // =====================================================
      if (!cancelled) {
        console.log('Maximum retry attempts reached');

        setError('Trying to reconnect');
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // =======================================================================
  // const totalIncome = transactions
  //   .filter(item => item.type === 'Income')
  //   .reduce((sum, item) => sum + Number(item.amount), 0);

  // const totalExpense = transactions
  //   .filter(item => item.type === 'Expense')
  //   .reduce((sum, item) => sum + Number(item.amount), 0);

  // const totalBalance = totalIncome - totalExpense;

  // =======================================================================

  const handleAddSort = e => {
    e.preventDefault();
    const form = e.target;
    // const sortTime = form.sortTime.value;
    const sortTime = new Date(form.sortTime.value).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });

    setSelectedMonthYear(sortTime);
  };
  // console.log(selectedMonthYear);

  const filteredTransactions =
    selectedMonthYear === ''
      ? transactions
      : transactions.filter(transaction => {
          const monthYear = new Date(transaction.date).toLocaleString(
            'default',
            {
              month: 'long',
              year: 'numeric',
            },
          );

          // ================= only for UTC
          // const monthYear = new Date(transaction.date)
          //   .toISOString()
          //   .slice(0, 7);

          return monthYear === selectedMonthYear;
        });

  // console.log(filteredTransactions);

  // Then continue with your calculations
  const totalIncome = filteredTransactions
    .filter(item => item.type === 'Income')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = filteredTransactions
    .filter(item => item.type === 'Expense')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalBalance = totalIncome - totalExpense;

  // ===============================================================================================
  const income = filteredTransactions.filter(item => item.type === 'Income');

  const expense = filteredTransactions.filter(item => item.type === 'Expense');

  const salaryIncomeAmount = income
    .filter(item => item.category === 'salary')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const salaryExpenseAmount = expense
    .filter(item => item.category === 'salary')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const freelanceIncomeAmount = income
    .filter(item => item.category === 'freelance')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const freelanceExpenseAmount = expense
    .filter(item => item.category === 'freelance')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const businessIncomeAmount = income
    .filter(item => item.category === 'business')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const businessExpenseAmount = expense
    .filter(item => item.category === 'business')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const transportIncomeAmount = income
    .filter(item => item.category === 'transport')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const transportExpenseAmount = expense
    .filter(item => item.category === 'transport')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const investmentIncomeAmount = income
    .filter(item => item.category === 'investment')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const investmentExpenseAmount = expense
    .filter(item => item.category === 'investment')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const billIncomeAmount = income
    .filter(item => item.category === 'bill')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const billExpenseAmount = expense
    .filter(item => item.category === 'bill')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const rentIncomeAmount = income
    .filter(item => item.category === 'rent')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const rentExpenseAmount = expense
    .filter(item => item.category === 'rent')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const foodIncomeAmount = income
    .filter(item => item.category === 'food')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const foodExpenseAmount = expense
    .filter(item => item.category === 'food')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const buyIncomeAmount = income
    .filter(item => item.category === 'buy')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const buyExpenseAmount = expense
    .filter(item => item.category === 'buy')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const othersIncomeAmount = income
    .filter(item => item.category === 'others')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const othersExpenseAmount = expense
    .filter(item => item.category === 'others')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // ===============================================================================================
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error === 'Trying to reconnect') {
    return <ReconnectServer />;
  }

  if (error === 'Unauthorized') {
    return <UnauthorizedAccess />;
  }

  if (error === 'Forbidden') {
    return <ForbiddenAccess />;
  }

  return (
    <div className="max-w-11/12 mx-auto py-25">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-[#5c23be]">
          Report Of The Transactions
        </h2>
        <p className="text-gray-600 mt-3 px-80">
          Check the report by the chart of the transaction, which will be easier
          to understand for your transaction monitor.
        </p>
      </div>

      {transactions.length > 0 ? (
        <div>
          {/* <div className="flex flex-col gap-2">
          <form onSubmit={handleAddSort}>
            <label className="font-medium">Sort By Month-Year: </label>
            <input
              type="month"
              name="sortTime"
              // placeholder="All Years"
              className="input input-bordered w-40"
              min="1"
              // onChange={e => setSelectedMonthYear(e.target.value)}
              defaultValue="2026-06"
              required
            />
            <button type="submit" className="btn btn-outline">
              Sort
            </button>
          </form>
          <button
            className="btn btn-outline"
            onClick={() => setSelectedMonthYear('')}
          >
            Default - Comprehensive Report Of All Time Periods
          </button>
        </div> */}
          <div
            className={`${theme === 'dark' ? 'bg-base-100' : 'bg-white'} drop-shadow-sm rounded-3xl border border-violet-100 p-3 mb-10`}
          >
            <div
              className={`flex justify-between p-3 rounded-3xl items-center ${selectedMonthYear === '' && theme === 'light' ? 'bg-gray-100' : selectedMonthYear === '' && theme === 'dark' ? 'bg-base-300' : 'bg-base-100'}`}
            >
              <div>
                <h3 className="text-2xl font-bold text-[#5c23be]">
                  Comprehensive Report
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Report of all time periods. Which is selected by default.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {selectedMonthYear === '' ? (
                  <p className="font-semibold text-[#522e90]">
                    Default selected
                  </p>
                ) : (
                  ''
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMonthYear('')}
                  className={`btn rounded-xl border-none text-white hover:bg-emerald-700 ${selectedMonthYear === '' ? 'bg-emerald-700' : 'bg-[#10B981]'}`}
                >
                  🌍 Comprehensive Report Of All Time Periods
                </button>
              </div>
            </div>
            <div className="border-t-2 border-dotted border-gray-300 mt-4 mb-4"></div>
            <div
              className={`flex flex-col lg:flex-row lg:items-end lg:justify-between p-3 rounded-3xl ${selectedMonthYear === '' && theme === 'light' ? 'bg-white' : selectedMonthYear === '' && theme === 'dark' ? 'bg-base-100' : 'bg-base-300'}`}
            >
              {/* Left Side */}
              <div>
                <h3 className="text-2xl font-bold text-[#5c23be]">
                  Filter Report
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Select any month and year to sort the transactions report for
                  a specific month.
                </p>
              </div>

              {/* Right Side */}
              <form
                onSubmit={handleAddSort}
                className="flex flex-wrap items-end gap-3"
              >
                <div className="flex flex-col">
                  <label className="font-semibold text-[#522e90] mb-2">
                    Month & Year
                  </label>

                  <input
                    type="month"
                    name="sortTime"
                    defaultValue={today}
                    required
                    className="input input-bordered rounded-xl w-48 focus:border-violet-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {selectedMonthYear === '' ? (
                    ''
                  ) : (
                    <p className="font-semibold text-[#522e90]">Sorted</p>
                  )}
                  <button
                    type="submit"
                    className={`btn rounded-xl border-none text-white hover:bg-[#4b1c9a]  ${selectedMonthYear === '' ? 'bg-[#7835ec]' : 'bg-[#4b1c9a]'}`}
                  >
                    <IoBarChart /> Sort The Report
                  </button>
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-x-3 px-5 py-2">
              <button
                onClick={() => setCategory('bycategory')}
                className={`btn rounded-xl border-none text-white px-5 hover:bg-emerald-700 ${category === 'bycategory' ? 'bg-emerald-700' : 'bg-[#10B981]'}`}
              >
                Report By Category
              </button>
              <button
                onClick={() => setCategory('type')}
                className={`btn rounded-xl border-none text-white px-5 hover:bg-emerald-700 ${category === 'bycategory' ? 'bg-[#10B981]' : 'bg-emerald-700'}`}
              >
                Report By Transaction Type
              </button>
            </div>
          </div>

          {filteredTransactions.length > 0 ? (
            <>
              <div className="flex justify-center">
                <div className="w-full">
                  {category === 'bycategory' ? (
                    <CategoryChart
                      salaryIncomeAmount={salaryIncomeAmount}
                      salaryExpenseAmount={salaryExpenseAmount}
                      freelanceIncomeAmount={freelanceIncomeAmount}
                      freelanceExpenseAmount={freelanceExpenseAmount}
                      businessIncomeAmount={businessIncomeAmount}
                      businessExpenseAmount={businessExpenseAmount}
                      transportIncomeAmount={transportIncomeAmount}
                      transportExpenseAmount={transportExpenseAmount}
                      investmentIncomeAmount={investmentIncomeAmount}
                      investmentExpenseAmount={investmentExpenseAmount}
                      billIncomeAmount={billIncomeAmount}
                      billExpenseAmount={billExpenseAmount}
                      rentIncomeAmount={rentIncomeAmount}
                      rentExpenseAmount={rentExpenseAmount}
                      foodIncomeAmount={foodIncomeAmount}
                      foodExpenseAmount={foodExpenseAmount}
                      buyIncomeAmount={buyIncomeAmount}
                      buyExpenseAmount={buyExpenseAmount}
                      othersIncomeAmount={othersIncomeAmount}
                      othersExpenseAmount={othersExpenseAmount}
                      selectedMonthYear={selectedMonthYear}
                    />
                  ) : (
                    <ResultsChart
                      totalIncome={totalIncome}
                      totalExpense={totalExpense}
                      totalBalance={totalBalance}
                      selectedMonthYear={selectedMonthYear}
                    />
                  )}
                  <p className="text-gray-400 text-xl font-medium text-center underline">
                    Chart of the transactions
                  </p>
                </div>
              </div>
              <div className="p-8 mt-10">
                <h4 className="text-3xl font-bold text-[#5c23be] mb-5">
                  Description:
                </h4>

                <p className="text-gray-700 text-lg leading-8 text-justify">
                  The report chart presents a comprehensive overview of your
                  financial activities by comparing total income, total
                  expenses, and the resulting balance within the selected
                  period. It enables you to quickly identify financial trends,
                  evaluate spending habits, measure savings, and understand your
                  overall financial health. Regularly reviewing this report can
                  help you make informed financial decisions, optimize your
                  budget, and maintain better control over your personal
                  finances.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="py-10 text-xl text-gray-400 text-center">
                You did not add any transactions in that month and year. Please
                add at least one transaction in that month and year to check the
                report in the chart. Then you can filter the chart for this
                month and year again.
                <br />
                <br />
                <span className="text-sm">
                  Click the button below for your choice
                </span>
              </p>
              <div className="flex justify-center gap-x-5">
                <Link
                  to={'/addTransactions'}
                  className="border-none text-white text-lg bg-linear-to-r from-violet-500 hover:from-violet-600 to-fuchsia-800 hover:scale-[1.10] duration-300 rounded-2xl py-2 px-5 flex items-center gap-2"
                >
                  <IoIosArrowBack className="text-4xl" />
                  Add Transactions
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedMonthYear('')}
                  className={`hover:scale-[1.10] duration-300 rounded-2xl py-2 px-5 flex items-center gap-2 text-lg border-none text-white hover:bg-emerald-700 ${selectedMonthYear === '' ? 'bg-emerald-700' : 'bg-[#10B981]'}`}
                >
                  🌍 Report Of All Time Periods
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="py-10 text-xl text-gray-400 text-center">
            Still, no transactions are added. Please create a transaction first.
            Then check the transaction report. You can also check all of the
            transactions report or can check the transactions by month. But you
            need to add transactions first.
          </p>
          <div className="flex justify-center">
            <Link
              to={'/addTransactions'}
              className="my-8 border-none text-white text-lg bg-linear-to-r from-violet-500 hover:from-violet-600 to-fuchsia-800 hover:scale-[1.10] duration-300 rounded-2xl py-2 px-5 flex items-center gap-2"
            >
              <IoIosArrowBack className="text-4xl" />
              Add Transactions
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;

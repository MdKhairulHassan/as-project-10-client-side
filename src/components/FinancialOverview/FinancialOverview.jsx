// import { useEffect, useState } from 'react';
// import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
// import FinancialBalance from './FinancialBalance';

// const FinancialOverview = () => {
//   const [balance, setBalance] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:3000/balance')
//       .then(res => res.json())
//       .then(data => {
//         setBalance(data);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // map all data first
//   // const allTitles = balance.map(item => item.title);

//   // If you want ONLY one specific item
//   const totalBalance = balance.find(item => item.title === 'Total Balance');
//   const incomeData = balance.find(item => item.title === 'Income');
//   const expenses = balance.find(item => item.title === 'Expenses');

//   return (
//     <div>
//       <FinancialBalance
//         totalBalance={totalBalance}
//         incomeData={incomeData}
//         expenses={expenses}
//       />
//     </div>
//   );
// };

// export default FinancialOverview;

// ===============================================================================
// import { useEffect, useState } from 'react';
// import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
// import FinancialBalance from './FinancialBalance';

// const FinancialOverview = () => {
//   const [balance, setBalance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:3000/balance')
//       .then(res => res.json())
//       .then(data => {
//         setBalance(data);
//       })
//       .catch(error => {
//         console.log(error);
//         setError('Server connection failed');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   const totalBalance = balance.find(item => item.title === 'Total Balance');

//   const incomeData = balance.find(item => item.title === 'Income');

//   const expenses = balance.find(item => item.title === 'Expenses');

//   return (
//     <div>
//       <FinancialBalance
//         totalBalance={totalBalance}
//         incomeData={incomeData}
//         expenses={expenses}
//       />
//     </div>
//   );
// };

// export default FinancialOverview;

// ===============================================================================================
import { useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FinancialBalance from './FinancialBalance';
// import { AuthContext } from '../../provider/AuthContext';
import ReconnectServer from '../ReconnectServer/ReconnectServer';
import UnauthorizedAccess from '../UnauthorizedAccess/UnauthorizedAccess';
import ForbiddenAccess from '../ForbiddenAccess/ForbiddenAccess';
import AxiosUseSecure from '../../provider/AxiosUseSecure';
import AxiosUseAuthProvider from '../../provider/AxiosUseAuthProvider';
import { useNavigate } from 'react-router';
import BadRequest from '../BadRequest/BadRequest';
import NotFound from '../NotFound/NotFound';

const FinancialOverview = () => {
  // const { user } = use(AuthContext);
  const [{ user, logOut }] = AxiosUseAuthProvider();
  const navigate = useNavigate();
  const axiosSecure = AxiosUseSecure();
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ===============================================================================================
  // console.log('token', user.accessToken);

  // const fetchBalance = async () => {
  //   try {
  //     const res = await fetch('http://localhost:3000/transactions');

  //     if (!res.ok) {
  //       throw new Error('Server Error');
  //     }

  //     const data = await res.json();

  //     setBalance(data);
  //     setError('');
  //     setLoading(false);

  //     return true; // success
  //   } catch (error) {
  //     console.log(error);
  //     setError('Trying to reconnect...');
  //     return false; // failed
  //   }
  // };

  // ===============================================================================================
  // // ======= fetchBalance().then() this line have a warning from ESLint. so try to avoid writing code like this.
  // // useEffect(() => {
  // //   let interval;

  // //   fetchBalance().then(success => {
  // //     // only retry when failed
  // //     if (!success) {
  // //       interval = setInterval(async () => {
  // //         const retrySuccess = await fetchBalance();

  // //         // stop retry after success
  // //         if (retrySuccess) {
  // //           clearInterval(interval);
  // //         }
  // //       }, 3000);
  // //     }
  // //   });

  // //   return () => clearInterval(interval);
  // // }, []);

  // // ==============
  // useEffect(() => {
  //   let interval;

  //   const loadData = async () => {
  //     const success = await fetchBalance();

  //     if (!success) {
  //       interval = setInterval(async () => {
  //         const retrySuccess = await fetchBalance();

  //         if (retrySuccess) {
  //           clearInterval(interval);
  //         }
  //       }, 3000);
  //     }
  //   };

  //   loadData();

  //   return () => clearInterval(interval);
  // }, []);

  // ===============================================================================================
  // useEffect(() => {
  //   if (!user?.email) {
  //     const loading = () => {
  //       setBalance([]);
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

  //       setBalance(data);
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
  // useEffect(() => {
  //   if (!user?.email) {
  //     const loading = () => {
  //       setBalance([]);
  //       setLoading(true);

  //       setTimeout(() => {
  //         setLoading(false);
  //       }, 2000);
  //     };

  //     loading();
  //     return;
  //   }

  //   let cancelled = false;

  //   const MAX_RETRIES = 6;
  //   const BASE_DELAY = 2000;
  //   const MAX_DELAY = 60000;

  //   const fetchBalance = async () => {
  //     try {
  //       const token = await user.getIdToken();

  //       const res = await fetch(
  //         `http://localhost:3000/transactions?email=${user.email}`,
  //         {
  //           headers: {
  //             authorization: `Bearer ${token}`,
  //             // authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         },
  //       );

  //       // =====================================================
  //       // 401 = Invalid/expired authentication
  //       // NEVER retry
  //       // =====================================================
  //       if (res.status === 401) {
  //         setError('Unauthorized');
  //         setLoading(false);

  //         return 'unauthorized';
  //       }

  //       // =====================================================
  //       // 403 = Authenticated but forbidden
  //       // NEVER retry
  //       // =====================================================
  //       if (res.status === 403) {
  //         setError('Forbidden');
  //         setLoading(false);

  //         return 'forbidden';
  //       }

  //       // =====================================================
  //       // 500+ = Server problem
  //       // Retry with exponential backoff
  //       // =====================================================
  //       if (res.status >= 500) {
  //         setLoading(false);

  //         return 'server';
  //       }

  //       // =====================================================
  //       // Other HTTP errors
  //       // =====================================================
  //       if (!res.ok) {
  //         throw new Error(`HTTP error: ${res.status}`);
  //       }

  //       const data = await res.json();

  //       if (cancelled) {
  //         return true;
  //       }

  //       setBalance(data);
  //       setError('');
  //       setLoading(false);

  //       return true;
  //     } catch (err) {
  //       if (cancelled) {
  //         return false;
  //       }

  //       console.error(err);

  //       setError('Trying to reconnect');
  //       setLoading(false);

  //       return 'network';
  //     }
  //   };

  //   const wait = ms => {
  //     return new Promise(resolve => {
  //       setTimeout(resolve, ms);
  //     });
  //   };

  //   const loadData = async () => {
  //     const firstAttempt = await fetchBalance();

  //     // =====================================================
  //     // Successful request
  //     // =====================================================
  //     if (firstAttempt === true) {
  //       return;
  //     }

  //     // =====================================================
  //     // Authentication problems
  //     // NEVER retry
  //     // =====================================================
  //     if (firstAttempt === 'unauthorized' || firstAttempt === 'forbidden') {
  //       return;
  //     }

  //     // =====================================================
  //     // Server/network problem
  //     // Start retry process
  //     // =====================================================
  //     for (let retryCount = 1; retryCount <= MAX_RETRIES; retryCount++) {
  //       if (cancelled) {
  //         return;
  //       }

  //       // Exponential backoff
  //       const exponentialDelay = Math.min(
  //         BASE_DELAY * 2 ** (retryCount - 1),
  //         MAX_DELAY,
  //       );

  //       // Jitter: random value between 0 and 1000 ms
  //       const jitter = Math.floor(Math.random() * 1000);

  //       const delay = exponentialDelay + jitter;

  //       console.log(`Retry ${retryCount}/${MAX_RETRIES} in ${delay}ms`);

  //       await wait(delay);

  //       if (cancelled) {
  //         return;
  //       }

  //       const result = await fetchBalance();

  //       // ===================================================
  //       // Success → STOP retrying
  //       // ===================================================
  //       if (result === true) {
  //         console.log('Server connection restored');
  //         return;
  //       }

  //       // ===================================================
  //       // 401 → STOP retrying
  //       // ===================================================
  //       if (result === 'unauthorized') {
  //         return;
  //       }

  //       // ===================================================
  //       // 403 → STOP retrying
  //       // ===================================================
  //       if (result === 'forbidden') {
  //         return;
  //       }

  //       // Otherwise continue retrying
  //     }

  //     // =====================================================
  //     // Maximum retry count reached
  //     // =====================================================
  //     if (!cancelled) {
  //       console.log('Maximum retry attempts reached');

  //       setError('Trying to reconnect');
  //     }
  //   };

  //   loadData();

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [user]);

  // ===============================================================================================
  useEffect(() => {
    if (!user?.email) {
      const loading = () => {
        setBalance([]);
        // setLoading(true);
        setLoading(false);
      };
      loading();
      // const timer = setTimeout(() => {
      //   setLoading(false);
      // }, 1000);

      // return () => clearTimeout(timer);
      return;
    }

    let cancelled = false;
    let redirectTimerOne;
    let redirectTimerTwo;

    const MAX_RETRIES = 6;
    const BASE_DELAY = 2000;
    const MAX_DELAY = 60000;

    const wait = ms => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    };

    const fetchBalance = async () => {
      try {
        // ========================================
        const response = await axiosSecure.get(
          `/transactions?email=${user.email}`,
        );

        // ========================================
        // header.Authorization is case-insensitive.
        // const response = await axios.get(
        //   `http://localhost:3000/transactions?email=${user.email}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   },
        // );

        // ========================================
        if (cancelled) {
          return 'cancelled';
        }

        setBalance(response.data);
        setError('');
        setLoading(false);

        return 'success';
      } catch (error) {
        if (cancelled) {
          return 'cancelled';
        }

        // ============================================
        // Axios HTTP error
        // ============================================

        if (error.response) {
          const status = error.response?.status;

          // 400
          if (status === 400) {
            setError('Bad Request');
            setLoading(false);

            return 'badrequest';
          }

          // 401
          if (status === 401) {
            setError('Unauthorized');
            setLoading(false);

            redirectTimerOne = setTimeout(() => {
              if (!cancelled) {
                logOut();
                navigate('/auth/login', { replace: true });
              }
            }, 3000);

            return 'unauthorized';
          }

          // 403
          if (status === 403) {
            setError('Forbidden');
            setLoading(false);

            redirectTimerTwo = setTimeout(() => {
              if (!cancelled) {
                logOut();
                navigate('/auth/login', { replace: true });
              }
            }, 3000);

            return 'forbidden';
          }

          // 404
          if (status === 404) {
            setError('Not Found');
            setLoading(false);

            return 'notfound';
          }

          // 500+
          if (status >= 500) {
            console.log(`Server error: ${status}`);

            setError('Trying to reconnect');
            setLoading(false);

            return 'server';
          }

          // Other HTTP errors
          console.log(`HTTP error: ${status}`);

          setError('Trying to reconnect');
          setLoading(false);

          return 'network';
        }

        // ============================================
        // Network error
        // Server completely unreachable
        // ============================================

        if (error.request) {
          console.log('Server/network connection failed');

          setError('Trying to reconnect');
          setLoading(false);

          return 'network';
        }

        // ============================================
        // Axios/request configuration error
        // ============================================

        console.log('Axios error:', error.message);

        setError('Trying to reconnect');
        setLoading(false);

        return 'network';
      }
    };

    const loadData = async () => {
      // ============================================
      // First request
      // ============================================

      const firstAttempt = await fetchBalance();

      if (cancelled) {
        return;
      }

      // ============================================
      // Success
      // ============================================

      if (firstAttempt === 'success') {
        return;
      }

      // ============================================
      // Authentication errors
      // NEVER retry
      // ============================================

      if (
        firstAttempt === 'unauthorized' ||
        firstAttempt === 'forbidden' ||
        firstAttempt === 'badrequest' ||
        firstAttempt === 'notfound'
      ) {
        return;
      }

      // ============================================
      // Retry server/network problems
      // ============================================

      for (let retryCount = 1; retryCount <= MAX_RETRIES; retryCount++) {
        if (cancelled) {
          return;
        }

        // Exponential backoff
        const exponentialDelay = Math.min(
          BASE_DELAY * 2 ** (retryCount - 1),
          MAX_DELAY,
        );

        // Random 0-1000ms
        const jitter = Math.floor(Math.random() * 1000);

        const delay = exponentialDelay + jitter;

        console.log(`Retry ${retryCount}/${MAX_RETRIES} in ${delay}ms`);

        await wait(delay);

        if (cancelled) {
          return;
        }

        const result = await fetchBalance();

        // ============================================
        // Server recovered
        // ============================================

        if (result === 'success') {
          console.log('Server connection restored');
          return;
        }

        // ============================================
        // Authentication error
        // Stop retrying
        // ============================================

        if (
          result === 'unauthorized' ||
          result === 'forbidden' ||
          result === 'badrequest' ||
          result === 'notfound'
        ) {
          return;
        }

        // Otherwise continue retrying
      }

      // ============================================
      // Maximum retries reached
      // ============================================

      if (!cancelled) {
        console.log('Maximum retry attempts reached');

        setError('Trying to reconnect');
      }
    };

    loadData();

    return () => {
      cancelled = true;
      clearTimeout(redirectTimerOne);
      clearTimeout(redirectTimerTwo);
    };
  }, [user, axiosSecure, logOut, navigate]);

  // ===============================================================================================
  // const incomeData = balance.find(item => item.type === 'Income');
  // const expensesData = balance.find(item => item.type === 'Expense');

  // const balanceData = incomeData - expensesData;

  // ===============================================================================================
  const { totalIncome, totalExpense } = balance.reduce(
    (acc, item) => {
      if (item.type === 'Income') {
        acc.totalIncome += Number(item.amount);
      } else if (item.type === 'Expense') {
        acc.totalExpense += Number(item.amount);
      }

      return acc;
    },
    {
      totalIncome: 0,
      totalExpense: 0,
    },
  );

  const totalBalance = totalIncome - totalExpense;

  console.log(totalBalance, totalIncome, totalExpense);

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

  if (error === 'Bad Request') {
    return <BadRequest />;
  }

  if (error === 'Not Found') {
    return <NotFound />;
  }

  // ===============================================================================================
  return (
    <div className="py-10">
      <FinancialBalance
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />
    </div>
  );
};

export default FinancialOverview;

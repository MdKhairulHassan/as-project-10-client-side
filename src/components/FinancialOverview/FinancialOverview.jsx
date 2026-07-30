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
import { use, useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import FinancialBalance from './FinancialBalance';
import { AuthContext } from '../../provider/AuthContext';
import ReconnectServer from '../ReconnectServer/ReconnectServer';

const FinancialOverview = () => {
  const { user } = use(AuthContext);
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
  useEffect(() => {
    if (!user?.email) {
      function loading() {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setBalance([]);
        }, 2000);
      }
      loading();
      return;
    }

    let interval;

    const fetchBalance = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/transactions?email=${user.email}`,
        );

        if (!res.ok) {
          throw new Error('Server Error');
        }

        const data = await res.json();

        setBalance(data);
        setError('');
        setLoading(false);

        return true;
      } catch (err) {
        console.error(err);

        setError('Trying to reconnect...');
        setLoading(false);

        return false;
      }
    };

    const load = async () => {
      const success = await fetchBalance();

      if (!success) {
        interval = setInterval(async () => {
          if (await fetchBalance()) {
            clearInterval(interval);
          }
        }, 3000);
      }
    };

    load();

    return () => clearInterval(interval);
  }, [user]);

  // ===============================================================================================

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ReconnectServer />;
  }

  // const incomeData = balance.find(item => item.type === 'Income');
  // const expensesData = balance.find(item => item.type === 'Expense');

  // const balanceData = incomeData - expensesData;

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

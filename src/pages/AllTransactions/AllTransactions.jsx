// // import Footer from '../../components/Footer/Footer';
// // import Navbar from '../../components/Navbar/Navbar';

// import { useEffect, useState } from 'react';
// import MyTransactions from '../../components/MyTransactions/MyTransactions';

// const AllTransactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   console.log(transactions);

//   useEffect(() => {
//     fetch('http://localhost:3000/transactions')
//       .then(res => res.json())
//       .then(data => {
//         setTransactions(data);
//         // setLoading(false);
//       });
//   }, []);

//   return (
//     <div>
//       {/* <h3>My transaction</h3> */}
//       {transactions.map((transaction, index) => (
//         <MyTransactions
//           transaction={transaction}
//           index={index}
//           key={transaction._id}
//         ></MyTransactions>
//       ))}
//     </div>
//   );
// };

// export default AllTransactions;

// ===============================================================================================
import { use, useEffect, useRef, useState } from 'react';
import MyTransactions from '../../components/MyTransactions/MyTransactions';
import { AuthContext } from '../../provider/AuthContext';
// import { toast } from 'react-toastify';
import { CalendarDays, CircleX, FileText, Wallet } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';
import { ThemeContext } from '../../provider/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ReconnectServer from '../../components/ReconnectServer/ReconnectServer';
import UnauthorizedAccess from '../../components/UnauthorizedAccess/UnauthorizedAccess';
import ForbiddenAccess from '../../components/ForbiddenAccess/ForbiddenAccess';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);

const AllTransactions = () => {
  const { user } = use(AuthContext);
  const { theme } = use(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [transactions, setTransactions] = useState([]);

  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortedText, setSortedText] = useState('default');

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const detailsRef = useRef(null);

  const updateRef = useRef(null);
  console.log(transactions);

  const now = new Date();

  const today =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, '0')}-` +
    `${String(now.getDate()).padStart(2, '0')}`; // for client side frontend local time zone

  const totalCategoryAmount = transactions
    .filter(
      transaction =>
        transaction.category === selectedTransaction?.category &&
        transaction.type === selectedTransaction?.type,
    )
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // useEffect(() => {
  //   fetch(`http://localhost:3000/transactions`)
  //     .then(res => res.json())
  //     .then(data => {
  //       setTransactions(data);
  //       setSortedTransactions(data);
  //     });
  // }, [user]);

  // ===============================================================================================
  // useEffect(() => {
  //   if (!user?.email) {
  //     const loading = () => {
  //       setTransactions([]);
  //       setSortedTransactions([]);
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
  //       setSortedTransactions(data);
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
        setSortedTransactions([]);
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
              // authorization: `Bearer ${localStorage.getItem('token')}`,
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
        setSortedTransactions(data);
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

  // ===============================================================================================
  const handleView = transaction => {
    setSelectedTransaction(transaction);

    detailsRef.current.showModal();
  };

  const handleEdit = transaction => {
    setSelectedTransaction(transaction);

    updateRef.current.showModal();
  };

  const handleUpdate = e => {
    e.preventDefault();

    const form = e.target;

    const updatedData = {
      title: form.title.value,

      amount: Number(form.amount.value),

      category: form.category.value,

      date: form.date.value,

      type: form.type.value,

      description: form.description.value,
    };

    fetch(`http://localhost:3000/transactions/${selectedTransaction._id}`, {
      method: 'PATCH',

      headers: {
        'content-type': 'application/json',
      },

      body: JSON.stringify(updatedData),
    })
      .then(res => res.json())

      .then(() => {
        // setTransactions(prev =>
        //   prev.map(item =>
        //     item._id === selectedTransaction._id
        //       ? { ...item, ...updatedData }
        //       : item,
        //   ),
        // );
        const updatedList = transactions.map(item =>
          item._id === selectedTransaction._id
            ? { ...item, ...updatedData }
            : item,
        );

        setTransactions(updatedList);
        setSortedTransactions(updatedList);

        // toast.success('Updated Successfully');

        Swal.fire({
          title: 'Update Successfully',
          text: 'Now check the updated transaction',
          icon: 'success',

          background: theme === 'dark' ? '#1D232A' : '#FFFFFF',

          color: theme === 'dark' ? '#F8FAFC' : '#111827',

          confirmButtonColor: '#5c23be',
        });

        updateRef.current.close();
      });
  };

  const handleDelete = id => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      background: theme === 'dark' ? '#1D232A' : '#FFFFFF',

      color: theme === 'dark' ? '#F8FAFC' : '#111827',

      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed)
        fetch(
          `http://localhost:3000/transactions/${id}`,

          {
            method: 'DELETE',
          },
        )
          .then(res => res.json())

          .then(() => {
            // setTransactions(prev => prev.filter(item => item._id !== id));

            const updatedList = transactions.filter(item => item._id !== id);

            setTransactions(updatedList);
            setSortedTransactions(updatedList);

            // toast.success('Deleted Successfully');

            Swal.fire({
              title: 'Deleted!',
              text: 'Your transaction has been deleted.',
              icon: 'success',
              background: theme === 'dark' ? '#1D232A' : '#FFFFFF',
              color: theme === 'dark' ? '#F8FAFC' : '#111827',
            });
          });
    });
  };

  const handleSort = value => {
    let sorted = [...transactions];

    switch (value) {
      case 'default':
        sorted = [...transactions];
        setSortedText('default');
        break;

      case 'amountHigh':
        sorted.sort((a, b) => Number(b.amount) - Number(a.amount));
        setSortedText('amountHigh');
        break;

      case 'amountLow':
        sorted.sort((a, b) => Number(a.amount) - Number(b.amount));
        setSortedText('amountLow');
        break;

      case 'income':
        setSortedText('income');
        sorted.sort((a, b) => {
          if (a.type === b.type) return 0;
          return a.type === 'Income' ? -1 : 1;
        });
        break;

      case 'expense':
        setSortedText('expense');
        sorted.sort((a, b) => {
          if (a.type === b.type) return 0;
          return a.type === 'Expense' ? -1 : 1;
        });
        break;

      // category
      case 'salary':
        setSortedText('salary');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'salary' ? -1 : 1;
        });
        break;

      case 'freelance':
        setSortedText('freelance');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'freelance' ? -1 : 1;
        });
        break;

      case 'business':
        setSortedText('business');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'business' ? -1 : 1;
        });
        break;

      case 'transport':
        setSortedText('transport');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'transport' ? -1 : 1;
        });
        break;

      case 'investment':
        setSortedText('investment');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'investment' ? -1 : 1;
        });
        break;

      case 'bill':
        setSortedText('bill');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'bill' ? -1 : 1;
        });
        break;

      case 'rent':
        setSortedText('rent');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'rent' ? -1 : 1;
        });
        break;

      case 'food':
        setSortedText('food');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'food' ? -1 : 1;
        });
        break;

      case 'buy':
        setSortedText('buy');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'buy' ? -1 : 1;
        });
        break;

      case 'others':
        setSortedText('others');
        sorted.sort((a, b) => {
          if (a.category === b.category) return 0;
          return a.category === 'others' ? -1 : 1;
        });
        break;

      case 'newest':
        setSortedText('newest');
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;

      case 'oldest':
        setSortedText('oldest');
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;

      default:
        setSortedText('default');
        sorted = [...transactions];
    }

    setSortedTransactions(sorted);
  };

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
    <div className="max-w-11/12 mx-auto py-15">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#5c23be]">
          All Of Your Transactions Are Here
        </h2>
        <p className="text-gray-600 mt-3">
          Check and update your transactions if necessary.
        </p>
      </div>

      {transactions.length > 0 ? (
        <>
          <div className="flex justify-end">
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className={`btn ${
                  sortedText !== 'default' ? 'bg-[#7835ec] text-white' : ''
                }`}
              >
                Sort By
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box w-56 shadow"
              >
                <li>
                  <summary
                    className={
                      sortedText === 'default' ? 'bg-[#7835ec] text-white' : ''
                    }
                    onClick={() => handleSort('default')}
                  >
                    Default
                  </summary>
                </li>
                <li>
                  <details>
                    <summary
                      className={
                        sortedText === 'newest' || sortedText === 'oldest'
                          ? 'bg-[#9963f7a8] text-white'
                          : theme === 'dark'
                            ? 'bg-base-100 text-white'
                            : 'bg-white text-black'
                      }
                    >
                      Date
                    </summary>

                    <ul>
                      <li>
                        <a
                          // className={
                          //   sortedText === 'newest' && 'bg-[#7835ec] text-white'
                          // }
                          className={
                            sortedText === 'newest'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('newest')}
                        >
                          Newest
                        </a>
                      </li>

                      <li>
                        <a
                          className={
                            sortedText === 'oldest'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('oldest')}
                        >
                          Oldest
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>

                <li>
                  <details>
                    <summary
                      className={
                        sortedText === 'amountHigh' ||
                        sortedText === 'amountLow'
                          ? 'bg-[#9963f7a8] text-white'
                          : theme === 'dark'
                            ? 'bg-base-100 text-white'
                            : 'bg-white text-black'
                      }
                    >
                      Amount
                    </summary>

                    <ul>
                      <li>
                        <a
                          className={
                            sortedText === 'amountHigh'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('amountHigh')}
                        >
                          High → Low
                        </a>
                      </li>

                      <li>
                        <a
                          className={
                            sortedText === 'amountLow'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('amountLow')}
                        >
                          Low → High
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>

                <li>
                  <details>
                    <summary
                      className={
                        sortedText === 'income' || sortedText === 'expense'
                          ? 'bg-[#9963f7a8] text-white'
                          : theme === 'dark'
                            ? 'bg-base-100 text-white'
                            : 'bg-white text-black'
                      }
                    >
                      Type
                    </summary>

                    <ul>
                      <li>
                        <a
                          className={
                            sortedText === 'income'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('income')}
                        >
                          Income First
                        </a>
                      </li>

                      <li>
                        <a
                          className={
                            sortedText === 'expense'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('expense')}
                        >
                          Expense First
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>

                <li>
                  <details>
                    <summary
                      className={
                        sortedText === 'salary' ||
                        sortedText === 'freelance' ||
                        sortedText === 'business' ||
                        sortedText === 'transport' ||
                        sortedText === 'investment' ||
                        sortedText === 'bill' ||
                        sortedText === 'rent' ||
                        sortedText === 'food' ||
                        sortedText === 'buy' ||
                        sortedText === 'others'
                          ? 'bg-[#9963f7a8] text-white'
                          : theme === 'dark'
                            ? 'bg-base-100 text-white'
                            : 'bg-white text-black'
                      }
                    >
                      Category
                    </summary>

                    <ul>
                      <li>
                        <a
                          className={
                            sortedText === 'salary'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('salary')}
                        >
                          Salary
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'freelance'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('freelance')}
                        >
                          Freelance
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'business'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('business')}
                        >
                          Business
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'transport'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('transport')}
                        >
                          Transport
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'investment'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('investment')}
                        >
                          Investment
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'bill'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('bill')}
                        >
                          Bill
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'rent'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('rent')}
                        >
                          Rent
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'food'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('food')}
                        >
                          Food
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'buy'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('buy')}
                        >
                          Buy
                        </a>
                      </li>
                      <li>
                        <a
                          className={
                            sortedText === 'others'
                              ? 'bg-[#7835ec] text-white'
                              : ''
                          }
                          onClick={() => handleSort('others')}
                        >
                          Others
                        </a>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </div>
          </div>
          <div className="overflow-x-auto border-y border-neutral-200 mb-16 mt-4">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>

                  <th>User</th>

                  <th>Category</th>

                  <th>Amount</th>

                  <th>Date</th>

                  <th>Type</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* {transactions.map((transaction, index) => (
              <MyTransactions
                key={transaction._id}
                transaction={transaction}
                index={index}
                user={user}
                handleView={handleView}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))} */}
                {sortedTransactions.map((transaction, index) => (
                  <MyTransactions
                    key={transaction._id}
                    transaction={transaction}
                    index={index}
                    user={user}
                    handleView={handleView}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <p className="py-10 text-xl text-gray-400 text-center">
            Still, no transactions are added. Please create a transaction first.
            Then check the transaction data.
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

      {/* ================================================= */}
      <dialog ref={detailsRef} className="modal">
        <div className="modal-box rounded-3xl max-w-lg max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="p-3 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 text-white">
              <FileText size={24} />
            </div>

            <div>
              <h3 className="text-2xl font-bold">Transaction Details</h3>

              <p className="text-sm opacity-60">
                Complete transaction information
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="bg-base-200 rounded-2xl p-4">
              <p className="text-sm opacity-60 mb-1">Transaction Type</p>

              <h2 className="font-bold text-lg">
                {selectedTransaction?.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-base-200 rounded-2xl p-4">
                <p className="text-sm opacity-60 mb-1">Amount</p>

                <h2
                  className={`font-bold text-lg ${
                    selectedTransaction?.type === 'Income'
                      ? 'text-green-600'
                      : 'text-red-500'
                  }`}
                >
                  ৳ {selectedTransaction?.amount}
                </h2>
              </div>

              <div className="bg-base-200 rounded-2xl p-4">
                <p className="text-sm opacity-60 mb-1">Category</p>

                <h2 className="font-bold capitalize">
                  {selectedTransaction?.category}
                </h2>
              </div>
              <div className="bg-base-200 rounded-2xl p-4">
                <p className="text-sm opacity-60 mb-1">Date</p>

                <h2 className="font-bold capitalize">
                  {new Date(selectedTransaction?.date).toLocaleDateString(
                    'en-US',
                  )}
                </h2>
              </div>
              <div className="bg-base-200 rounded-2xl p-4">
                <p className="text-sm opacity-60 mb-1">Type</p>

                <h2 className="font-bold capitalize">
                  {selectedTransaction?.type}
                </h2>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <p className="text-sm opacity-60 mb-1">Description</p>

              <p className="leading-relaxed">
                {selectedTransaction?.description}
              </p>
            </div>
            <div className="bg-base-200 rounded-2xl p-4">
              <p className="text-sm opacity-60 mb-1">
                Total Amount Of This Category & Type
              </p>

              <h2
                className={`font-bold text-lg ${
                  selectedTransaction?.type === 'Income'
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                $ {totalCategoryAmount}
              </h2>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end mt-8">
            <button
              className="btn border-none text-white rounded-xl bg-linear-to-r from-rose-500 to-red-600"
              onClick={() => detailsRef.current.close()}
            >
              <CircleX size={18} />
              Close
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* ================================================= */}

      <dialog ref={updateRef} className="modal">
        <div className="modal-box rounded-3xl max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
          {/* Top Gradient */}
          <div className="h-2 bg-linear-to-r from-violet-600 via-fuchsia-500 to-blue-500"></div>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-linear-to-r from-violet-500 to-fuchsia-500 text-white">
                <FileText size={24} />
              </div>

              <div>
                <h3 className="text-2xl font-bold">Update Transaction</h3>

                <p className="text-sm opacity-60">
                  Modify transaction information
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdate}>
              {/* Title */}
              <div className="bg-base-200 rounded-2xl p-4 mb-4">
                <label className="font-semibold mb-2 block">Title</label>

                <input
                  name="title"
                  defaultValue={selectedTransaction?.title}
                  className="input input-bordered w-full rounded-xl"
                />
              </div>

              {/* Amount */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-base-200 rounded-2xl p-4">
                  <label className="font-semibold mb-2 block">Amount</label>

                  <input
                    name="amount"
                    type="number"
                    defaultValue={selectedTransaction?.amount}
                    className="input input-bordered w-full rounded-xl"
                  />
                </div>

                {/* Category */}
                <div className="bg-base-200 rounded-2xl p-4">
                  <label className="font-semibold mb-2 block">Category</label>

                  <select
                    name="category"
                    defaultValue={selectedTransaction?.category}
                    className="select select-bordered w-full rounded-xl"
                  >
                    <option value="salary">Salary</option>
                    <option value="freelance">Freelance</option>
                    <option value="business">Business</option>
                    <option value="transport">Transport</option>
                    <option value="investment">Investment</option>
                    <option value="bill">Bill</option>
                    <option value="rent">Rent</option>
                    <option value="food">Food</option>
                    <option value="buy">Buy</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Date */}
                <div className="bg-base-200 rounded-2xl p-4">
                  <label className="mb-2 block font-semibold">Date</label>

                  <label className="input input-bordered flex items-center gap-3 rounded-xl">
                    <CalendarDays size={18} className="text-pink-500" />

                    <input
                      type="date"
                      name="date"
                      // onChange={handleChange}
                      defaultValue={today}
                      className="grow"
                    />
                  </label>
                </div>

                {/* Type */}
                <div className="bg-base-200 rounded-2xl p-4">
                  <label className="mb-2 block font-semibold">Type</label>

                  <label className="input input-bordered flex items-center gap-3 rounded-xl">
                    <Wallet size={18} className="text-orange-500" />

                    <select
                      name="type"
                      defaultValue="Expense"
                      // onChange={handleChange}
                      className="w-full bg-transparent outline-none"
                    >
                      <option className="bg-base-100" value="Income">
                        Income
                      </option>
                      <option className="bg-base-100" value="Expense">
                        Expense
                      </option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Description */}

              <div className="bg-base-200 rounded-2xl p-4">
                <label className="font-semibold mb-2 block">Description</label>

                <textarea
                  name="description"
                  defaultValue={selectedTransaction?.description}
                  className="textarea textarea-bordered w-full h-28 rounded-xl resize-none"
                />
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="submit"
                  className="btn border-none text-white rounded-xl bg-linear-to-r from-violet-600 to-fuchsia-500 hover:scale-105 duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => updateRef.current.close()}
                  className="btn border-none text-white rounded-xl bg-linear-to-r from-rose-500 to-red-600 hover:scale-105 duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default AllTransactions;

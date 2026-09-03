// import { useRef } from 'react';

// const AddTransactions = () => {
//   const addTransactionsModalRef = useRef(null);

//   const handleTransactionModalOpen = () => {
//     addTransactionsModalRef.current.showModal();
//   };

//   return (
// <div>
//   <div className="max-w-11/12 mx-auto flex justify-center">
//     <button
//       onClick={handleTransactionModalOpen}
//       type="submit"
//       className="w-2/12 my-8 border-none text-white text-lg bg-linear-to-r from-violet-400 hover:from-violet-600 to-fuchsia-800 hover:scale-[1.10] duration-300 rounded-2xl py-2 px-3"
//     >
//       Add Transactions
//     </button>

//     <dialog
//       ref={addTransactionsModalRef}
//       className="modal modal-bottom sm:modal-middle"
//     >
//       <div className="modal-box">
//         <h3 className="font-bold text-lg">Hello!</h3>
//         <p className="py-4">Press ESC key or click the button below to close</p>

//         <div className="modal-action">
//           <form method="dialog">
//             {/* if there is a button in form, it will close the modal */}
//             <button className="btn">Close</button>
//           </form>
//         </div>
//       </div>
//     </dialog>
//   </div>
// </div>;
//   );
// };

// export default AddTransactions;

// =========================================================================================================
import { useEffect, useRef, useState } from 'react';
import {
  Wallet,
  CirclePlus,
  CircleX,
  BadgeDollarSign,
  CalendarDays,
  Layers3,
  FileText,
  User,
  Mail,
  DollarSign,
} from 'lucide-react';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../../provider/AuthContext';
// import { ThemeContext } from '../../provider/ThemeContext';
// import axios from 'axios';
// import AxiosUseInstance from '../../provider/AxiosUseInstance';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ReconnectServer from '../../components/ReconnectServer/ReconnectServer';
import UnauthorizedAccess from '../../components/UnauthorizedAccess/UnauthorizedAccess';
import ForbiddenAccess from '../../components/ForbiddenAccess/ForbiddenAccess';
import AxiosUseAuthProvider from '../../provider/AxiosUseAuthProvider';
import AxiosUseSecure from '../../provider/AxiosUseSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import BadRequest from '../../components/BadRequest/BadRequest';
import NotFound from '../../components/NotFound/NotFound';

const AddTransactions = () => {
  // ======== Destructuring from object
  // const { user } = use(AuthContext);

  // ======== Destructuring from object of objects
  // const {
  //   axiosAuthInfo: { user },
  //   axiosAuthTheme: { theme },
  // } = AxiosUseAuthProvider();

  // ======== Destructuring from array of objects
  const [{ user, logOut }, { theme }] = AxiosUseAuthProvider();
  const navigate = useNavigate();
  // const axiosInstance = AxiosUseInstance();
  const axiosSecure = AxiosUseSecure();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log(user);

  const addTransactionsModalRef = useRef(null);

  const transactionsDetailsModalRef = useRef(null);

  const handleTransactionModalOpen = () => {
    addTransactionsModalRef.current.showModal();
  };

  // const handleTransactionDetailsModalOpen = () => {
  //   transactionsDetailsModalRef.current.showModal();
  // };

  const handleTransactionDetailsModalOpen = transaction => {
    setSelectedTransaction(transaction);
    transactionsDetailsModalRef.current.showModal();
  };

  const [transactionData, setTransactionData] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('final data', transactionData);

  // const today = new Date().toISOString().split('T')[0]; // only for backed UTC time

  const now = new Date();

  const today =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, '0')}-` +
    `${String(now.getDate()).padStart(2, '0')}`; // for client side frontend local time zone

  const totalCategoryAmount = transactionData
    .filter(
      transaction =>
        transaction.category === selectedTransaction?.category &&
        transaction.type === selectedTransaction?.type,
    )
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  // ===============================================================================================
  // const [transactionData, setTransactionData] = useState({
  //   // _id: '67f0a1b2c3d4e5f601000001',
  //   // title: 'Total Balance',
  //   // type: 'Income',
  //   // category: 'salary',
  //   // amount: 25480,
  //   // date: '2026-04-28',
  //   // email: 'xyz@gmail.com',
  //   // description: 'current available balance',
  //   // name: 'Hero',
  // });

  // console.log(transactionData);

  // const handleChange = e => {
  //   const { name, value } = e.target;

  //   setTransactionData({
  //     ...transactionData,
  //     [name]: value,
  //   });
  // };

  // ===============================================================================================
  // 1. Create a ref to hold the form data object
  // const transactionData = useRef({});

  // const handleChange = e => {
  //   const { name, value } = e.target;

  //   // 2. Update the ref directly.
  //   // This happens instantly without causing a re-render.
  //   transactionData.current = {
  //     ...transactionData.current,
  //     [name]: value,
  //   };
  // };

  // ===============================================================================================
  const getTransactionErrorMessage = error => {
    const status = error.response?.status;

    if (!status) {
      return 'Cannot reach the server. Check your connection and try again.';
    }

    if (status === 400) {
      return (
        error.response.data?.message || 'Please check the transaction details.'
      );
    }

    if (status === 401) {
      return 'Your sign-in session has expired. Please sign in again.';
    }

    if (status === 403) {
      return 'You do not have permission to add this transaction.';
    }

    if (status === 409) {
      return 'This transaction already exists.';
    }

    if (status >= 500) {
      return 'The server has a problem. Please try again shortly.';
    }
    return 'Unable to add the transaction. Please try again.';
  };

  // ===============================================================================================
  const handleAddTransaction = async e => {
    e.preventDefault();

    // const form = e.target; // e.target IS the <form> element here, and perform better accurate target point.

    const form = e.currentTarget; // perform better for the icon-used button.

    const title = form.title.value;
    const email = form.email.value;
    const amount = form.amount.value;
    const category = form.category.value;
    const type = form.type.value;
    const date = form.date.value;
    // const date = new Date(form.date.value);
    const name = form.name.value;
    const description = form.description.value;

    const newTransaction = {
      title,
      email,
      amount,
      category,
      type,
      date,
      name,
      description,
    };

    // console.log(newTransaction);

    // addTransactionsModalRef.current.close();

    // =============================================================================
    // fetch('http://localhost:3000/transactions', {
    //   method: 'POST',
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    //   body: JSON.stringify(newTransaction),
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     const savedTransaction = {
    //       ...newTransaction,
    //       _id: data.insertedId,
    //     };
    //     setTransactionData(prev => [savedTransaction, ...prev]);
    //     // setTransactionData(prev => [...prev, savedTransaction]);
    //     // setTransactionData(prev => [...prev, data]);

    //     console.log('after placing transaction', data);

    //     if (data.insertedId) {
    //       toast.success('Transaction Added Successfully', {
    //         theme: theme,
    //       });
    //       addTransactionsModalRef.current.close();
    //       e.target.reset();
    //     }
    //   })
    //   .catch(() => {
    //     // console.error(error);
    //     toast.error('Failed to add transaction. Please try again.');
    //   });

    // =============================================================================
    // axios
    //   .post('http://localhost:3000/transactions', newTransaction)
    //   .then(data => {
    //     const savedTransaction = {
    //       ...newTransaction,
    //       _id: data.data.insertedId,
    //     };
    //     setTransactionData(prev => [savedTransaction, ...prev]);
    //     // setTransactionData(prev => [...prev, savedTransaction]);
    //     // setTransactionData(prev => [...prev, data]);

    //     console.log('after placing transaction', data.data);

    //     if (data.data.insertedId) {
    //       toast.success('Transaction Added Successfully', {
    //         theme: theme,
    //       });
    //       addTransactionsModalRef.current.close();
    //       e.target.reset();
    //     }
    //   })
    //   .catch(() => {
    //     // console.error(error);
    //     toast.error('Failed to add transaction. Please try again.', {
    //       theme: theme,
    //     });
    //   });

    // =============================================================================
    // await axiosSecure
    //   .post('/transactions', newTransaction)
    //   .then(data => {
    //     const savedTransaction = {
    //       ...newTransaction,
    //       _id: data.data.insertedId,
    //     };
    //     setTransactionData(prev => [savedTransaction, ...prev]);
    //     // setTransactionData(prev => [...prev, savedTransaction]);
    //     // setTransactionData(prev => [...prev, data]);

    //     console.log('after placing transaction', data.data);

    //     if (data.data.insertedId) {
    //       toast.success('Transaction Added Successfully', {
    //         theme: theme,
    //       });
    //       addTransactionsModalRef.current.close();
    //       e.target.reset();
    //     }
    //   })
    //   .catch(() => {
    //     // console.error(error);
    //     toast.error('Failed to add transaction. Please try again.', {
    //       theme: theme,
    //     });
    //   });

    // =============================================================================
    // await axiosSecure
    //   .post('/transactions', newTransaction)
    //   .then(data => {
    //     const savedTransaction = {
    //       ...newTransaction,
    //       _id: data.data.insertedId,
    //     };
    //     setTransactionData(prev => [savedTransaction, ...prev]);
    //     // setTransactionData(prev => [...prev, savedTransaction]);
    //     // setTransactionData(prev => [...prev, data]);

    //     console.log('after placing transaction', data.data);

    //     if (data.data.insertedId) {
    //       toast.success('Transaction Added Successfully', {
    //         theme: theme,
    //       });
    //       addTransactionsModalRef.current.close();
    //       e.target.reset();
    //     }
    //   })
    //   .catch(() => {
    //     // console.error(error);
    //     toast.error('Failed to add transaction. Please try again.', {
    //       theme: theme,
    //     });
    //   });

    // =============================================================================
    try {
      setIsSubmitting(true);

      const response = await axiosSecure.post('/transactions', newTransaction);

      const savedTransaction = {
        ...newTransaction,
        _id: response.data.insertedId,
      };

      setTransactionData(previous => [savedTransaction, ...previous]);

      Swal.fire({
        title: 'Transaction added successfully',
        text: 'Now check the added transaction.',
        icon: 'success',

        background: theme === 'dark' ? '#1D232A' : '#FFFFFF',

        color: theme === 'dark' ? '#F8FAFC' : '#111827',

        confirmButtonColor: '#5c23be',
      });

      // toast.success('Transaction added successfully.', {
      //   theme,
      // });

      form.reset();
      addTransactionsModalRef.current.close();
    } catch (error) {
      // console.error('Add transaction failed:', error);

      Swal.fire({
        title: 'Failed to add transaction',
        text: getTransactionErrorMessage(error),
        icon: 'error',

        background: theme === 'dark' ? '#1D232A' : '#FFFFFF',

        color: theme === 'dark' ? '#F8FAFC' : '#111827',

        confirmButtonColor: '#5c23be',
      });
      addTransactionsModalRef.current.close();

      // toast.error(getTransactionErrorMessage(error), {
      //   theme,
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===============================================================================================
  // const handleCancel = () => {
  //   toast.error('Transaction Cancelled');
  // };

  // ===============================================================================================
  // useEffect(() => {
  //   fetch('http://localhost:3000/transactions')
  //     .then(res => res.json())
  //     .then(data => {
  //       setTransactionData(data);
  //       console.log('transaction added', data);
  //     });
  // }, []);

  // ===============================================================================================
  // useEffect(() => {
  //   if (!user?.email) {
  //     const loading = () => {
  //       setTransactionData([]);
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

  //       setTransactionData(data);
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
  //       setTransactionData([]);
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

  //       setTransactionData(data);
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
        setTransactionData([]);
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
        // ========================================// Don't try to take email input from the client like this. It could create a vulnerability, allowing sophisticated hackers to determine whether your email exists in Firebase or in the database. Then they could try multiple times with this email to access the website database.
        // const response = await axiosSecure.get(
        //   `/transactions?email=${user.email}`,
        // );

        // ======================================== But this is the safest way after updating the server security.
        const response = await axiosSecure.get(`/transactions`);

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

        setTransactionData(response.data);
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
    <div className="max-w-11/12 mx-auto flex flex-col items-center justify-center p-4">
      <div className="text-center my-12">
        <h2 className="text-4xl font-bold text-[#5c23be]">
          Add Your Transactions Here
        </h2>
        <p className="text-gray-600 mt-3">
          Check the transactions after adding.
        </p>
      </div>
      {/* Post Transactions */}
      <button
        onClick={handleTransactionModalOpen}
        type="submit"
        className="w-2/12 my-8 border-none text-white text-lg hover:scale-[1.10] duration-300 rounded-2xl py-2 px-3 bg-linear-to-r from-violet-500 hover:from-violet-400 to-fuchsia-400"
      >
        Add Transactions
      </button>
      <dialog ref={addTransactionsModalRef} className="modal">
        <div className="modal-box max-w-4xl p-0 bg-transparent shadow-none max-h-[90vh] overflow-y-auto">
          <div className="bg-base-100 shadow-2xl rounded-3xl border border-base-300 overflow-hidden overflow-x-hidden">
            {/* Top Gradient */}
            <div className="h-2 bg-linear-to-r from-violet-600 via-fuchsia-500 to-blue-500"></div>

            <div className="p-8">
              {/* Header */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-100 to-blue-100 flex items-center justify-center shadow-md mb-4 border border-violet-200">
                  <Wallet size={40} className="text-violet-600" />
                </div>

                <h2 className="text-4xl font-extrabold text-center">
                  Add{' '}
                  <span className="bg-linear-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                    Transaction
                  </span>
                </h2>

                <p className="text-base-content/60 mt-2 text-sm">
                  Create your transaction
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAddTransaction}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Title */}
                  <div>
                    <label className="label p-1">
                      <span className="label-text font-semibold">Title</span>
                    </label>

                    <label className="input input-bordered flex items-center gap-3 rounded-xl">
                      <BadgeDollarSign size={18} className="text-violet-500" />

                      <input
                        name="title"
                        type="text"
                        // onChange={handleChange}
                        placeholder="Enter title"
                        className="grow"
                        required
                      />
                    </label>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="label p-1">
                      <span className="label-text font-semibold">Amount</span>
                    </label>

                    <label className="input input-bordered flex items-center gap-3 rounded-xl">
                      <DollarSign size={18} className="text-green-500" />

                      <input
                        name="amount"
                        type="number"
                        // onChange={handleChange}
                        placeholder="Enter amount"
                        className="grow"
                        required
                      />
                    </label>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="label p-1">
                      <span className="label-text font-semibold">Category</span>
                    </label>

                    <label className="input input-bordered flex items-center gap-3 rounded-xl">
                      <Layers3 size={18} className="text-blue-500" />

                      <select
                        name="category"
                        type="text"
                        defaultValue="Salary"
                        // onChange={handleChange}
                        className="w-full outline-none bg-base-100"
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
                    </label>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="label p-1">
                      <span className="label-text font-semibold">Type</span>
                    </label>

                    <label className="input input-bordered flex items-center gap-3 rounded-xl">
                      <Wallet size={18} className="text-orange-500" />

                      <select
                        name="type"
                        type="text"
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

                  {/* Date */}
                  <div>
                    <label className="label p-1">
                      <span className="label-text font-semibold">Date</span>
                    </label>

                    <label className="input input-bordered flex items-center gap-3 rounded-xl">
                      <CalendarDays size={18} className="text-pink-500" />

                      <input
                        name="date"
                        type="date"
                        defaultValue={today}
                        // onChange={handleChange}
                        className="grow"
                      />
                    </label>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="label p-1">
                      <span className="label-text font-semibold">
                        User Name
                      </span>
                    </label>

                    <label className="input input-bordered flex items-center gap-3 rounded-xl bg-base-100 cursor-not-allowed">
                      <User size={18} className="text-cyan-500" />

                      <input
                        name="name"
                        type="text"
                        defaultValue={user?.displayName}
                        // onChange={handleChange}
                        placeholder="Enter user name"
                        className="grow bg-base-100"
                      />
                    </label>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="label p-1">
                      <span className="label-text font-semibold">Email</span>
                    </label>

                    <label className="input input-bordered flex items-center gap-3 rounded-xl bg-base-300 cursor-not-allowed">
                      <Mail size={18} className="text-violet-500" />

                      <input
                        name="email"
                        type="email"
                        defaultValue={user?.email}
                        // onChange={handleChange}
                        placeholder="Enter email"
                        className="grow cursor-not-allowed bg-base-300"
                        readOnly
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-5">
                  <label className="label p-1">
                    <span className="label-text font-semibold">
                      Description
                    </span>
                  </label>

                  <label className="textarea textarea-bordered flex gap-3 rounded-2xl">
                    <FileText size={18} className="text-fuchsia-500 mt-1" />

                    <textarea
                      name="description"
                      type="textarea"
                      // defaultValue={''}
                      // onChange={handleChange}
                      placeholder="Write transaction details... example: advance house rent pay"
                      className="w-full h-28 outline-none bg-transparent resize-none"
                      required
                    ></textarea>
                  </label>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn border-none text-white rounded-xl text-lg bg-linear-to-r from-violet-600 to-fuchsia-500 hover:scale-[1.02] duration-300 ${isSubmitting && 'bg-linear from-gray-600 to-gray-400'}`}
                  >
                    <CirclePlus size={22} />
                    {isSubmitting ? 'Adding Transaction...' : 'Add Transaction'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // handleCancel();
                      addTransactionsModalRef.current.close();
                    }}
                    className="btn border-none text-white rounded-xl text-lg bg-linear-to-r from-rose-500 to-red-600 hover:scale-[1.02] duration-300"
                  >
                    <CircleX size={22} />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Close Modal Outside Click */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {transactionData.length > 0 ? (
        /* Get Transactions */
        <div className="w-full overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl mb-20">
          {/* Scroll Container */}
          <div className="overflow-x-auto overflow-y-auto max-h-screen">
            <table className="table table-zebra min-w-225">
              {/* head */}
              <thead className="bg-base-200 text-base-content sticky top-0 z-10">
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
                {transactionData.map((transaction, index) => (
                  <tr key={transaction._id} className="hover">
                    {/* Index */}
                    <th>{index + 1}</th>

                    {/* User Info */}
                    <td>
                      <div className="flex items-center gap-4 min-w-63">
                        <div className="avatar">
                          <div className="w-14 rounded-2xl ring ring-violet-300 ring-offset-base-100 ring-offset-2">
                            <img src={user?.photoURL} alt="user-photo" />
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-lg">
                            {transaction.name}
                          </div>

                          <div className="text-sm opacity-60 break-all">
                            {transaction.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="badge badge-primary badge-outline px-4 py-3 capitalize">
                        {transaction.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td>
                      <span
                        className={`font-bold text-base ${
                          transaction.type === 'Income'
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        ৳ {transaction.amount}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="min-w-30">
                      {/* {transaction.date?.split('T')[0]} */}
                      {new Date(transaction.date).toISOString().split('T')[0]}
                    </td>

                    {/* Type */}
                    <td>
                      <span
                        className={`badge px-4 py-3 text-white ${
                          transaction.type === 'Income'
                            ? 'badge-success'
                            : 'badge-error'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>

                    {/* Action */}
                    <td>
                      <button
                        onClick={() =>
                          handleTransactionDetailsModalOpen(transaction)
                        }
                        className="btn btn-sm rounded-xl border-none text-white bg-linear-to-r from-violet-600 to-fuchsia-500 hover:scale-105 duration-300"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <dialog ref={transactionsDetailsModalRef} className="modal">
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
                        $ {selectedTransaction?.amount}
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
                    onClick={() => transactionsDetailsModalRef.current.close()}
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
          </div>
        </div>
      ) : (
        <div>
          <p className="py-10 text-xl text-gray-400">
            Still, no transactions are added. Please create a transaction first.
            Then check the transaction data.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddTransactions;

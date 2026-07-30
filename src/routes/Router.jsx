// import { createBrowserRouter } from 'react-router';
// import RootLayout from '../layouts/RootLayout';
// import Home from '../pages/Home/Home';
// import AddTransactions from '../pages/AddTransactions/AddTransactions';
// import AllTransactions from '../pages/AllTransactions/AllTransactions';
// import Reports from '../pages/Reports/Reports';
// import Login from '../pages/Login/Login';
// import Error from '../pages/Error/Error';
// import Register from '../pages/Login/Register';
// import AuthLayout from '../layouts/AuthLayout';
// import PrivateRoute from '../provider/PrivateRoute';
// import MyProfile from '../pages/MyProfile/MyProfile';
// import Profile from '../pages/MyProfile/Profile';
// import UpdateProfile from '../pages/MyProfile/UpdateProfile';
// // import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

// const Router = createBrowserRouter([
//   {
//     path: '/',
//     element: <RootLayout></RootLayout>,

//     // hydrateFallbackElement: <LoadingSpinner></LoadingSpinner>,

//     children: [
//       {
//         index: true,
//         element: <Home></Home>,
//         // Improved version
//         // loader: async () => {
//         //   const response = await fetch('http://localhost:3000/latest-balance');
//         //   return response.json();
//         // },
//         // hydrateFallbackElement: <LoadingSpinner></LoadingSpinner>,
//       },

//       // {
//       //   index: true,

//       //   // Improved version with defer()
//       //   loader: async () => {
//       //     return defer({
//       //       balancePromise: fetch('http://localhost:3000/latest-balance').then(
//       //         res => res.json(),
//       //       ),
//       //     });
//       //   },

//       //   Component: Home,
//       // },

//       // for inside the path error pages
//       // {
//       //   path: '/*',
//       //   Component: Error,
//       // },
//     ],
//   },
//   {
//     path: '/addTransactions',
//     element: (
//       <PrivateRoute>
//         <AddTransactions></AddTransactions>
//       </PrivateRoute>
//     ),
//   },
//   {
//     path: '/allTransactions',
//     element: (
//       <PrivateRoute>
//         <AllTransactions></AllTransactions>
//       </PrivateRoute>
//     ),
//   },
//   {
//     path: '/reports',
//     element: (
//       <PrivateRoute>
//         <Reports></Reports>
//       </PrivateRoute>
//     ),
//     // hydrateFallbackElement: <LoadingSpinner></LoadingSpinner>,
//   },
//   {
//     path: '/myprofile',
//     element: (
//       <PrivateRoute>
//         <MyProfile></MyProfile>
//       </PrivateRoute>
//     ),
//     children: [
//       {
//         path: '/myprofile/profile',
//         element: (
//           <PrivateRoute>
//             <Profile></Profile>
//           </PrivateRoute>
//         ),
//       },
//       {
//         path: '/myprofile/updateprofile',
//         element: (
//           <PrivateRoute>
//             <UpdateProfile></UpdateProfile>
//           </PrivateRoute>
//         ),
//       },
//     ],
//   },
//   {
//     path: '/auth',
//     element: <AuthLayout></AuthLayout>,
//     children: [
//       {
//         path: '/auth/login',
//         element: <Login></Login>,
//       },
//       {
//         path: '/auth/register',
//         element: <Register></Register>,
//       },
//     ],
//   },
//   {
//     path: '/*',
//     Component: Error,
//   },
// ]);

// export default Router;

// ========================================================= Component syntax using with private route
// {
//   element: <PrivateRoute />, // Acts as a wrapper layout
//   children: [
//     {
//       path: "addTransactions",
//       Component: AddTransactions, // Clean and modern
//     },
//     {
//       path: "dashboard",
//       Component: Dashboard,
//     }
//   ]
// },

// =====================================================================
import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/Home/Home';
import AddTransactions from '../pages/AddTransactions/AddTransactions';
import AllTransactions from '../pages/AllTransactions/AllTransactions';
import Reports from '../pages/Reports/Reports';
import Login from '../pages/Login/Login';
import Error from '../pages/Error/Error';
import Register from '../pages/Login/Register';
import AuthLayout from '../layouts/AuthLayout';
import PrivateRoute from '../provider/PrivateRoute';
import MyProfile from '../pages/MyProfile/MyProfile';
import Profile from '../pages/MyProfile/Profile';
import UpdateProfile from '../pages/MyProfile/UpdateProfile';
// import UpdateOrDetailsIncome from '../components/FinancialOverview/UpdateOrDetailsIncome';

const Router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout, // Standard root UI layout

    children: [
      {
        index: true,
        Component: Home,
      },
      // GROUP 1: Protected pages using RootLayout
      {
        element: <PrivateRoute />, // Uses our updated layout protector
        children: [
          {
            path: 'addTransactions', // Removed leading slash
            Component: AddTransactions,
          },
          {
            path: 'allTransactions', // Removed leading slash
            Component: AllTransactions,
          },
          {
            path: 'reports', // Removed leading slash
            Component: Reports,
          },
          // {
          //   path: 'updateOrDetailsIncome/:id', // Removed leading slash
          //   loader: ({ params }) => fetch(`http://localhost:3000/balance/${params.id}`),
          //   Component: UpdateOrDetailsIncome,
          // },
        ],
      },
      // GROUP 2: Protected profile pages nested inside /myprofile
      {
        path: 'myprofile',
        element: <PrivateRoute />, // Wraps the profile sub-layout
        children: [
          {
            path: '', // Base path matching '/myprofile'
            Component: MyProfile,
          },
          {
            path: 'profile', // Resolves cleanly to /myprofile/profile
            Component: Profile,
          },
          {
            path: 'updateprofile', // Resolves cleanly to /myprofile/updateprofile
            Component: UpdateProfile,
          },
        ],
      },
    ],
  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        path: 'login', // Removed leading slash
        Component: Login,
      },
      {
        path: 'register', // Removed leading slash
        Component: Register,
      },
    ],
  },
  {
    path: '*',
    Component: Error,
  },
]);

export default Router;

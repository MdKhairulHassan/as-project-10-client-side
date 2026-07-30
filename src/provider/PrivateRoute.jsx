import { use } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router'; // Added Outlet
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = use(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user && user?.email) {
    // If children exist, render them (for Option A).
    // If no children exist, render the <Outlet /> (for Option B layout groupings).
    return children ? children : <Outlet />;
  }

  return (
    <Navigate
      to="/auth/login"
      state={{
        from: location.pathname,
        message: 'Please login first to access this page',
      }}
      replace
    />
  );
};

export default PrivateRoute;

// ================================================================ for showing a extra loading
// import { use, useEffect, useState } from 'react';
// import { useNavigate, useLocation, Outlet} from 'react-router';
// import { AuthContext } from './AuthProvider';
// import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = use(AuthContext);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Fix 1: Hooks must ALWAYS be at the top level, never inside "if/else" statements
//   useEffect(() => {
//     // Only start the timer if authentication loading is finished AND there is no user
//     if (!loading && (!user || !user?.email)) {
//       setIsLoading(true);

//       const timer = setTimeout(() => {
//         setIsLoading(false);
//         navigate('/auth/login', { state: location.pathname });
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [user, loading, navigate, location.pathname]);

//   // Fix 2: Handle initial authentication check from your AuthProvider
//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   // Fix 3: Handle the 1-second delay spinner state
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   // Fix 4: If user exists, securely return the children components
//   if (user && user?.email) {
//     return children ? children : <Outlet />;
//   }

//   // Fallback return while redirection finishes
//   return null;
// };

// export default PrivateRoute;

// ======================================
// if -> user have! then return children
// navigate--> Login

// ================================================================ common method
// import { use } from 'react';
// import { useLocation, Navigate } from 'react-router';
// // import { AuthContext } from './AuthProvider';
// import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
// import { AuthContext } from './AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { user, loading } = use(AuthContext);

//   const location = useLocation();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (user && user?.email) {
//     return children;
//   }

//   return (
//     <Navigate
//       to="/auth/login"
//       state={{
//         from: location.pathname,
//         message: 'Please login first to access this page',
//       }}
//       replace
//     />
//   );
// };

// export default PrivateRoute;

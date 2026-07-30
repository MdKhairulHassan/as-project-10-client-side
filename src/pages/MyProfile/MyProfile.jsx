import { Navigate, Outlet } from 'react-router';

const MyProfile = () => {
  return (
    <div>
      <Navigate
        to="/myprofile/profile"
        state={{
          from: location.pathname,
          message: 'Please login first to access this page',
        }}
        // replace
      />
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default MyProfile;

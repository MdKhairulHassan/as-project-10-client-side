// import axios from 'axios';
// import AxiosUseAuthProvider from './AxiosUseAuthProvider';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3000',
// });

// const AxiosUseSecure = () => {
//   const [{ user }] = AxiosUseAuthProvider();
//   const token = user.getIdToken();
//   // set token in the header for all the api call using axios secure hook
//   axiosInstance.interceptors.request.use(config => {
//     // request interceptor
//     // console.log(config);
//     config.headers.authorization = `Bearer ${token}`;
//     // config.headers.set('Authorization', `Bearer ${token}`);

//     return config;
//   });

//   return axiosInstance;
// };
// export default AxiosUseSecure;

// =======================================================================================================
import axios from 'axios';
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import AxiosUseAuthProvider from './AxiosUseAuthProvider';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:3000',
});

const AxiosUseSecure = () => {
  const [{ user }] = AxiosUseAuthProvider();
  // const [{ user, logOut }] = AxiosUseAuthProvider();
  // const navigate = useNavigate();

  useEffect(() => {
    // ==================================================================== interceptors request
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async config => {
        if (user) {
          const token = await user.getIdToken();

          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      error => Promise.reject(error),
    );

    // ==================================================================== interceptors response
    // const responseInterceptor = axiosSecure.interceptors.response.use(
    //   res => {
    //     return res;
    //   },

    //   async error => {
    //     const status = error.res?.status;

    //     // ============================================
    //     // Token missing, expired, invalid, or revoked
    //     if (status === 401 || status === 403) {}
    //     if (status === 401 {
    //       console.log('log out the user for bad request.');
    //       await logOut();

    //       const timer = setTimeout(() => {
    //         navigate('/auth/login', { replace: true });
    //       }, 1000);
    //       return () => clearTimeout(timer);
    //     }

    //     // if (status === 403) {
    //     //   console.log('Forbidden request');
    //     // }

    //     // Do NOT automatically log out on 403.
    //     // 403 means: user is signed in, but is not allowed
    //     // to do this specific action.

    //     // Important: send the error back to the calling page.
    //     // ============================================
    //     return Promise.reject(error);
    //   },
    // );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      // axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user]);

  return axiosSecure;
};

export default AxiosUseSecure;

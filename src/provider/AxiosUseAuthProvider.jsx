import { use } from 'react';
import { AuthContext } from './AuthContext';
import { ThemeContext } from './ThemeContext';

const AxiosUseAuthProvider = () => {
  const axiosAuthInfo = use(AuthContext);
  const axiosAuthTheme = use(ThemeContext);

  // const contextApi = {
  //   axiosAuthInfo,
  //   axiosAuthTheme,
  // };

  const contextApi = [axiosAuthInfo, axiosAuthTheme];
  return contextApi;
};

export default AxiosUseAuthProvider;

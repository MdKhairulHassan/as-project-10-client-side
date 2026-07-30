import { Outlet, useNavigation } from 'react-router';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const RootLayout = () => {
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  return (
    <div>
      <Navbar />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className={`transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        >
          <Outlet />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RootLayout;

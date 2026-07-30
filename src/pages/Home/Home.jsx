import Banner from '../../components/Banner/Banner';
import Budgeting from '../../components/Budgeting/Budgeting';
import FinancialOverview from '../../components/FinancialOverview/FinancialOverview';
import FinancialPlanning from '../../components/FinancialPlanning/FinancialPlanning';

const Home = () => {
  return (
    <div className="pb-20">
      <Banner />
      <div className="max-w-11/12 mx-auto">
        <FinancialOverview />
      </div>
      <div className="max-w-11/12 mx-auto">
        <Budgeting />
      </div>
      <div className="max-w-11/12 mx-auto">
        <FinancialPlanning />
      </div>
    </div>
  );
};

export default Home;

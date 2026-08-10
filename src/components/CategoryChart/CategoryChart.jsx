import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
// import { RechartsDevtools } from '@recharts/devtools';

const CategoryChart = ({
  salaryIncomeAmount,
  salaryExpenseAmount,
  freelanceIncomeAmount,
  freelanceExpenseAmount,
  businessIncomeAmount,
  businessExpenseAmount,
  transportIncomeAmount,
  transportExpenseAmount,
  investmentIncomeAmount,
  investmentExpenseAmount,
  billIncomeAmount,
  billExpenseAmount,
  rentIncomeAmount,
  rentExpenseAmount,
  foodIncomeAmount,
  foodExpenseAmount,
  buyIncomeAmount,
  buyExpenseAmount,
  othersIncomeAmount,
  othersExpenseAmount,
  selectedMonthYear,
}) => {
  const data = [
    {
      name: 'salary',
      income: salaryIncomeAmount,
      expense: salaryExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'freelance',
      income: freelanceIncomeAmount,
      expense: freelanceExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'business',
      income: businessIncomeAmount,
      expense: businessExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'transport',
      income: transportIncomeAmount,
      expense: transportExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'investment',
      income: investmentIncomeAmount,
      expense: investmentExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'bill',
      income: billIncomeAmount,
      expense: billExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'rent',
      income: rentIncomeAmount,
      expense: rentExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'food',
      income: foodIncomeAmount,
      expense: foodExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'buy',
      income: buyIncomeAmount,
      expense: buyExpenseAmount,
      date: selectedMonthYear,
    },
    {
      name: 'others',
      income: othersIncomeAmount,
      expense: othersExpenseAmount,
      date: selectedMonthYear,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white border rounded-xl shadow-lg p-4">
          <p
            className={`font-bold capitalize ${
              data.income === data.expense
                ? 'text-[#5c23be]'
                : data.income > data.expense
                  ? 'text-green-600'
                  : 'text-red-500'
            }`}
          >
            {data.name}
          </p>

          <p className={'text-green-600'}>
            Income: <strong>${data.income}</strong>
          </p>

          <p className={'text-red-500'}>
            Expense: <strong>${data.expense}</strong>
          </p>

          <p className="text-[#5c23be]">
            Date: <strong>{data.date || 'All Time Periods'}</strong>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-90 mt-3 mb-45">
      <p className="text-[#5c23be] text-lg font-bold pb-5">
        Report By Transaction Category Chart:
      </p>
      <BarChart
        style={{
          width: '100%',
          maxHeight: '80vh',
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis width="auto" />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey="income"
          fill="#82ca9d"
          activeBar={{ fill: 'green', stroke: 'green' }}
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="expense"
          fill="#dc5454ec"
          activeBar={{ fill: 'red', stroke: 'red' }}
          radius={[10, 10, 0, 0]}
        />
        {/* <RechartsDevtools /> */}
      </BarChart>
    </div>
  );
};

export default CategoryChart;

import { use } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ThemeContext } from '../../provider/ThemeContext';

const ResultsChart = ({
  totalIncome,
  totalExpense,
  totalBalance,
  selectedMonthYear,
}) => {
  const chartData = [
    {
      date: selectedMonthYear,
      type: 'Income',
      amount: totalIncome,
    },
    {
      date: selectedMonthYear,
      type: 'Expense',
      amount: totalExpense,
    },
    {
      date: selectedMonthYear,
      type: 'Balance',
      amount: totalBalance,
    },
  ];

  const { theme } = use(ThemeContext);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white border rounded-xl shadow-lg p-4">
          <p
            className={`font-bold ${
              data.type === 'Income'
                ? 'text-green-600'
                : data.type === 'Expense'
                  ? 'text-red-600'
                  : 'text-[#5c23be]'
            }`}
          >
            {data.type}
          </p>

          <p
            className={
              data.type === 'Income'
                ? 'text-green-600'
                : data.type === 'Expense'
                  ? 'text-red-600'
                  : 'text-[#5c23be]'
            }
          >
            Amount: <strong>${data.amount}</strong>
          </p>

          <p className="text-blue-500">
            Date: <strong>{data.date || 'All Time Periods'}</strong>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-4/5 h-120 mt-15 mb-20">
      <p className="text-[#5c23be] text-lg font-bold">Report By Chart</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={650}
          height={350}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 40,
          }}
        >
          <XAxis
            dataKey="type"
            label={{
              value: 'Transaction Type',
              position: 'bottom',
              offset: 15,
            }}
          />

          <YAxis
            width={80}
            tickFormatter={value => `$${value}`}
            label={{
              value: 'Amount ($)',
              angle: -90,
              position: 'left',
              offset: 20,
            }}
          />

          {/* <Tooltip formatter={value => [`$${value}`, 'Amount']} /> */}

          {/* ================================================= */}
          {/* <Tooltip
            labelFormatter={(label, payload) => {
              if (payload.length) {
                return `${label} (${payload[0].payload.date})`;
              }
              return label;
            }}
            formatter={value => [`$${value}`, 'Amount']}
          /> */}

          {/* ================================================= */}
          <Tooltip content={CustomTooltip} />

          <Bar dataKey="amount">
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.type === 'Income' && theme === 'light'
                    ? '#14ff99'
                    : entry.type === 'Income' && theme === 'dark'
                      ? '#19422a'
                      : entry.type === 'Expense' && theme === 'light'
                        ? '#ff1b1bec'
                        : entry.type === 'Expense' && theme === 'dark'
                          ? '#8B0000'
                          : entry.type !== 'Expense' &&
                              entry.type !== 'Income' &&
                              theme !== 'dark'
                            ? '#9400D3'
                            : '#5b0453'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;

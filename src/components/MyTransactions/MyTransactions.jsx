const MyTransactions = ({
  transaction,
  index,
  handleView,
  handleEdit,
  handleDelete,
  user,
}) => {
  return (
    <tr className="hover">
      <th>{index + 1}</th>

      <td>
        <div className="flex items-center gap-4 min-w-63">
          <div className="avatar">
            <div className="w-14 rounded-2xl ring ring-violet-300 ring-offset-base-100 ring-offset-2">
              <img src={user?.photoURL} alt="" />
            </div>
          </div>

          <div>
            <div className="font-bold text-lg">{transaction.name}</div>

            <div className="text-sm opacity-60">{transaction.email}</div>
          </div>
        </div>
      </td>

      <td>
        <span className="badge badge-primary badge-outline capitalize">
          {transaction.category}
        </span>
      </td>

      <td>
        <span
          className={`font-bold ${
            transaction.type === 'Income' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          ৳ {transaction.amount}
        </span>
      </td>

      <td>{new Date(transaction.date).toISOString().split('T')[0]}</td>

      <td>
        <span
          className={`badge text-white ${
            transaction.type === 'Income' ? 'badge-success' : 'badge-error'
          }`}
        >
          {transaction.type}
        </span>
      </td>

      <td>
        <div className="flex gap-2">
          <button
            onClick={() => handleView(transaction)}
            className="btn btn-xs btn-info"
          >
            Details
          </button>

          <button
            onClick={() => handleEdit(transaction)}
            className="btn btn-xs btn-warning"
          >
            Update
          </button>

          <button
            onClick={() => handleDelete(transaction._id)}
            className="btn btn-xs btn-error"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MyTransactions;

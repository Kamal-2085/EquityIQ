const ChargesTable = ({ data }) => {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {data.headers.map((head, i) => (
              <th key={i} className="px-4 py-3 font-medium text-gray-700 border-b">
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className="border-t">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChargesTable;

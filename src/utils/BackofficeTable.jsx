import React, { useState, useRef, useMemo } from 'react';
import TableModal from './TableModal';

// Table headers for the main table
const mainTableHeaders = [
  { id: 'sno', label: '#' },
  { id: 'name', label: 'Name' },
  { id: 'month', label: 'Month' },
  { id: 'roi', label: 'ROI' },
  { id: 'pnl', label: 'PNL' },
  { id: 'capital_invested', label: 'Capital' },
  { id: 'profit_days', label: 'Profit Days' },
  { id: 'loss_days', label: 'Loss Days' },
];

// Table headers for the sub-table
const subTableHeaders = [
  { id: 'sno', label: '#' },
  { id: 'date', label: 'Date' },
  // { id: 'month', label: 'Month' },
  { id: 'pnl', label: 'PNL' },
  { id: 'capital_invested', label: 'Capital' },
  { id: 'profit_days', label: 'Profit Days' },
  { id: 'loss_days', label: 'Loss Days' },
  { id: 'trading_symbol', label: 'Trading Symbol' },
];

// Helper function to transform trade data
const transformTradeData = (tradeData) => {
  return tradeData.flatMap((trader) => {
    return trader.monthwise_data.map((monthData) => ({
      name: trader.name,
      month: monthData.month,
      roi: monthData.capital_invested ? ((monthData.pnl / monthData.capital_invested) * 100).toFixed(2) : 0,
      pnl: monthData.pnl,
      percentage_pnl: monthData.capital_invested ? ((monthData.pnl / monthData.capital_invested) * 100).toFixed(2) : 0,
      capital_invested: monthData.capital_invested,
      profit_days: monthData.profit_days,
      loss_days: monthData.loss_days,
      historical_data: monthData.daywise_data.map((day) => ({
        date: day.date,
        // month: day.month,
        pnl: day.pnl,
        percentage_pnl: day.capital_invested ? ((day.pnl / day.capital_invested) * 100).toFixed(2) : 0,
        capital_invested: day.capital_invested,
        profit_days: day.profit_days,
        loss_days: day.loss_days,
        trading_symbol: day.trading_symbol,
      })),
      seg: `${trader.name} (${monthData.month})`,
    }));
  });
};

// Helper functions for sorting
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  const aValue = typeof a[orderBy] === 'string' && !isNaN(parseFloat(a[orderBy]))
    ? parseFloat(a[orderBy])
    : a[orderBy];
  const bValue = typeof b[orderBy] === 'string' && !isNaN(parseFloat(b[orderBy]))
    ? parseFloat(b[orderBy])
    : b[orderBy];

  if (bValue < aValue) return -1;
  if (bValue > aValue) return 1;
  return 0;
}

function stableSort(array, comparator) {
  if (!array || array.length === 0) return [];
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Row component
const Row = ({ row, idx, SubTableheaders }) => {
  const [open, setOpen] = useState(false);
  const [subOrder, setSubOrder] = useState('asc');
  const [subOrderBy, setSubOrderBy] = useState('date');
  const rowRef = useRef(null);

  const handleRowClick = () => {
    setOpen(!open);
  };

  const handleSubRequestSort = (property) => () => {
    const isAsc = subOrderBy === property && subOrder === 'asc';
    setSubOrder(isAsc ? 'desc' : 'asc');
    setSubOrderBy(property);
  };

  const sortedHistoricalData = useMemo(() => {
    return stableSort(row.historical_data || [], getComparator(subOrder, subOrderBy));
  }, [row.historical_data, subOrder, subOrderBy]);

  // Calculate stats for display in sub-table header
  const profitDays = sortedHistoricalData.filter((day) => day.pnl >= 0).length;
  const lossDays = sortedHistoricalData.filter((day) => day.pnl < 0).length;

  return (
    <>
      <tr ref={rowRef} onClick={handleRowClick} className="cursor-pointer">
        <td className="text-center py-2 px-4 text-white">{idx + 1}</td>
        <td className="text-center py-2 px-4 text-white">{row.name}</td>
        <td className="text-center py-2 px-4 text-white">{row.month}</td>
        <td className="text-center py-2 px-4">
          <span className={row.roi < 0 ? 'text-red-400' : 'text-green-400'}>
            {row.roi}%
          </span>
        </td>
        <td className="text-center py-2 px-4">
          <div className="flex justify-center items-center gap-2">
            <span className={row.pnl < 0 ? 'text-red-400' : 'text-green-400'}>
              ₹{row.pnl.toLocaleString('en-IN')}
            </span>
            {/* <span className="text-gray-400 text-sm">({row.percentage_pnl}%)</span> */}
          </div>
        </td>
        <td className="text-center py-2 px-4">
          <span className="text-white">
            ₹{row.capital_invested.toLocaleString('en-IN')}
          </span>
        </td>
        <td className="text-center py-2 px-4 text-green-400">{row.profit_days}</td>
        <td className="text-center py-2 px-4 text-red-400">{row.loss_days}</td>
      </tr>

      {open && (
        <tr>
          <td colSpan={8} className="p-0 border-t border-gray-700">
            <div className="p-2 bg-gray-900">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-100">{row.seg}</h3>
                <div className="flex gap-4">
                  <div className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-600">
                    <span className="text-green-400 font-medium">Profit Days: {profitDays}</span>
                  </div>
                  <div className="bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-600">
                    <span className="text-red-400 font-medium">Loss Days: {lossDays}</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-64 rounded-lg border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#011620] sticky top-0 w-full overflow-hidden">
                    <tr>
                      {SubTableheaders.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-xs font-medium text-white uppercase tracking-wider text-center cursor-pointer"
                          onClick={handleSubRequestSort(header.id)}
                        >
                          {header.label}
                          {subOrderBy === header.id ? (
                            subOrder === 'asc' ? ' ↑' : ' ↓'
                          ) : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-[#011f2c] divide-y divide-gray-700 overscroll-y-auto">
                    {sortedHistoricalData.map((historyRow, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-white text-center">{index + 1}</td>
                        <td className="px-4 py-2 text-sm text-white text-center">{historyRow.date}</td>
                        {/* <td className="px-4 py-2 text-sm text-white text-center">{historyRow.month}</td> */}
                        <td className="px-4 py-2 text-sm text-center">
                          <div className="flex justify-center items-center gap-2">
                            <span className={historyRow.pnl < 0 ? 'text-red-400' : 'text-green-400'}>
                              ₹{historyRow.pnl.toLocaleString('en-IN')}
                            </span>
                            {/* <span className="text-gray-400 text-xs">({historyRow.percentage_pnl}%)</span> */}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-white text-center">
                          ₹{historyRow.capital_invested.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-2 text-sm text-green-400 text-center">{historyRow.profit_days}</td>
                        <td className="px-4 py-2 text-sm text-red-400 text-center">{historyRow.loss_days}</td>
                        <td className="px-4 py-2 text-sm text-white text-center">{historyRow.trading_symbol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// Main component
const BackofficeTable = ({ data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    pnl: '',
    trading_symbol: '',
    capital_invested: '',
    profit_days: '',
    loss_days: ''
  });
  const scrollContainerRef = useRef(null);

  // Transform the incoming trade data
  const transformedData = useMemo(() => transformTradeData(data), [data]);

  const handleRequestSort = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    return stableSort(transformedData, getComparator(order, orderBy));
  }, [transformedData, order, orderBy]);

  const handleOpenModal = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      name: '',
      pnl: '',
      trading_symbol: '',
      capital_invested: '',
      profit_days: '',
      loss_days: ''
    });
    setIsModalOpen(true);
  };

  return (
    <div ref={scrollContainerRef} className="p-4 rounded-lg max-h-screen overflow-auto">
      <div className='flex justify-end'>
        <button
          onClick={handleOpenModal}
          className="bg-[#307c9d] hover:bg-[#307c9f] text-white font-medium py-1 px-4 rounded mb-2 cursor-pointer"
        >
          Add Entries
        </button>
      </div>

      {isModalOpen && (
        <TableModal setIsModalOpen={setIsModalOpen} formData={formData} setFormData={setFormData} />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 border border-gray-700">
          <thead className="bg-[#011620] sticky top-0 z-10">
            <tr>
              {mainTableHeaders.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-sm font-medium text-white uppercase tracking-wider text-center cursor-pointer hover:bg-gray-700"
                  onClick={handleRequestSort(header.id)}
                >
                  {header.label}
                  {orderBy === header.id ? (order === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-gray-700">
            {sortedData.map((row, idx) => (
              <Row key={idx} row={row} idx={idx} SubTableheaders={subTableHeaders} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BackofficeTable;
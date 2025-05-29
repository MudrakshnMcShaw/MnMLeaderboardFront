import { useState } from 'react';
import TableModal from './TableModal';
import { toast } from 'sonner';
const TradingTable = ({ data, setRerender }) => {
  const [expandedTraders, setExpandedTraders] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});
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

  const toggleTrader = (name) => {
    setExpandedTraders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleMonth = (traderName, month) => {
    const key = `${traderName}-${month}`;
    setExpandedMonths((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
    console.log("Modal opened");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  const formatMonth = (monthString) => {
    const date = new Date(monthString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    });
  }
 const nameEmojiMap = {
  'Shubham': '🧑🏻',
  'aditya': '🧑🏻‍🦰',
  'alind': '🧑🏻‍🦱',
  'ishaan': '🧔🏻',
  'ashutosh': '👨🏻'
};

const getEmojiForName = (name) => {
  return nameEmojiMap[name] || '👤'; // default fallback emoji
};

  return (
    <div className="overflow-x-auto p-6">
        <div className='flex gap-4 justify-end'>
        <button 
        onClick={handleOpenModal}
        className="text-indigo-500  bg-white/20 px-5 py-1 rounded-2xl shadow-md cursor-pointer hover:from-indigo-600 hover:to-purple-600 focus:outline-none transition-all duration-200 ease-in-out mb-4">
            Entre Trade 💹
        </button>
        <button 
        onClick={() => setRerender((prev) => !prev)}
        className="text-indigo-500  bg-white/10 p-1.5 rounded-full shadow-md cursor-pointer hover:from-indigo-600 hover:to-purple-600 focus:outline-none transition-all duration-200 ease-in-out mb-4">
            😇
        </button>
        {/* {isModalOpen && (
        <TableModal setIsModalOpen={setIsModalOpen} formData={formData} setFormData={setFormData} />
      )} */}
      {isModalOpen && (
        <div className="absolute mt-2 z-50 w-96 bg-transparent backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-0 text-white">
            <TableModal
            setIsModalOpen={setIsModalOpen}
            formData={formData}
            setFormData={setFormData}
            />
          </div>
        )}

      </div>
      <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-700 text-gray-200 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <td className="px-6 py-3">Trader</td>
              <td className="px-6 py-3 text-center">ROI (%)</td>
              <td className="px-6 py-3 text-center">Capital</td>
              <td className="px-6 py-3 text-center">Total PnL</td>
              <td className="px-6 py-3 text-center">Profit Days</td>
              <td className="px-6 py-3 text-center">Loss Days</td>
            </tr>
          </thead>
          <tbody className="text-gray-100 divide-y divide-gray-700">
            {data.map((trader) => (
              <>
                <tr
                  key={trader.name}
                  onClick={() => toggleTrader(trader.name)}
                  className="hover:bg-gray-700 cursor-pointer transition"
                >
                  <td className="px-6 py-3 font-medium flex items-center gap-2">
                     {getEmojiForName(trader.name)} {trader.name}
                  </td>
                  <td className="px-6 py-3 text-center">{trader.roi}%</td>
                  <td className="px-6 py-3 text-center">₹{trader.capital_invested}</td>
                  <td className={`px-6 py-3 text-center ${trader.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{trader.pnl}</td>
                  <td className="px-6 py-3 text-center">{trader.profit_days}</td>
                  <td className="px-6 py-3 text-center">{trader.loss_days}</td>
                </tr>

                {/* Monthly Breakdown */}
                {expandedTraders[trader.name] &&
                  trader.monthwise_data?.map((month) => (
                    <>
                      <tr
                        key={`${trader.name}-${month.month}`}
                        onClick={() => toggleMonth(trader.name, month.month)}
                        className="bg-gray-700 hover:bg-gray-600 cursor-pointer transition text-sm"
                      >
                        <td className="px-10 py-2 font-medium flex items-center gap-2" colSpan={2}>
                          {expandedMonths[`${trader.name}-${month.month}`] ? '▼' : '▶'} {formatMonth(month.month)}
                        </td>
                        <td className="px-6 py-3 text-center">{month.roi}%</td>
                        <td className="px-6 py-2 text-center">₹{month.capital_invested}</td>
                        <td className={`px-6 py-2 text-center ${month.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{month.pnl}</td>
                        <td className="px-6 py-2 text-center">{month.profit_days}</td>
                        <td className="px-6 py-2 text-center">{month.loss_days}</td>
                      </tr>

                      {/* Day-wise breakdown */}
                      {expandedMonths[`${trader.name}-${month.month}`] &&
                        month.daywise_data?.map((day, index) => (
                          <tr
                            key={`${trader.name}-${month.month}-${day.date}-${index}`}
                            className="text-gray-400 text-xs bg-gray-800"
                          >
                            <td className="px-14 py-1" colSpan={2}>
                               {formatDate(day.date)}
                            </td>
                            <td className="px-6 py-1 text-center">₹{day.capital_invested}</td>
                            <td
                              className={`px-6 py-1 text-center ${
                                day.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}
                            >
                              {day.pnl}
                            </td>
                            <td className="px-6 py-1 text-center">{day.profit_days}</td>
                            <td className="px-6 py-1 text-center">{day.loss_days}</td>
                          </tr>
                        ))}
                    </>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradingTable;

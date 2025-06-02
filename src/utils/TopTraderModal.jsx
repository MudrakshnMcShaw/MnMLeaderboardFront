import React, {useRef, useEffect} from "react";
import { X } from "lucide-react"; // for the close icon

const TopTraderModal = ({ setIsTopModalOpen, data }) => {
  const handleCloseModal = () => setIsTopModalOpen(false);

  const modalRef = useRef();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsTopModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsTopModalOpen]);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
      ref={modalRef}
      className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-lg text-white">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-white hover:text-red-400 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">🏆 Top 3 Traders</h2>

        <div className="space-y-4">
          {data.slice(0, 3).map((trader, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 bg-gradient-to-r ${
                index === 0
                  ? "from-yellow-500/10 to-yellow-400/10"
                  : index === 1
                  ? "from-gray-400/10 to-white/10"
                  : "from-orange-500/10 to-red-500/10"
              } border border-white/10 p-4 rounded-xl shadow-md`}
            >
              <div className="text-xl font-bold text-yellow-300">#{index + 1}</div>
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-white/10">
                <span className="text-2xl">{getEmojiForName(trader.name)}</span>
                </div>

              <div className="flex-1">
                <div className="text-lg font-medium">{trader.name}</div>
                <div className="text-sm text-green-400">Profit: ₹{trader.pnl}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopTraderModal;


// import React, { useRef, useEffect } from 'react';

// const TopTraderModal = ({ setIsTopModalOpen, data }) => {
//   const modalRef = useRef();

//   // Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsTopModalOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [setIsTopModalOpen]);

//   return (
//     <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
//       <div
//         ref={modalRef}
//         className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-md text-white"
//       >
//         {/* Your content goes here */}
//         <h2 className="text-xl font-bold mb-4">🏆 Top 3 Traders</h2>
//         {/* Example content */}
//         {data.map((trader, index) => (
//           <div key={index} className="flex items-center gap-3 mb-3">
//             <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-white/10">
//               <span className="text-2xl">{getMedalEmoji(index)}</span>
//             </div>
//             <div>
//               <p className="font-semibold">{trader.name}</p>
//               <p className="text-sm text-gray-400">Profit: ₹{trader.pnl}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const getMedalEmoji = (index) => {
//   const medals = ['🥇', '🥈', '🥉'];
//   return medals[index] || '🏅';
// };

// export default TopTraderModal;

// import React from 'react';

// const apiurl = import.meta.env.VITE_REACT_APP_SERVER_URL;

// const TableModal = ({ setIsModalOpen, formData, setFormData, }) => {
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
        
//         // Update form data
//         const updatedFormData = {
//             ...formData,
//             [name]: value,
//         };

//         // If PnL is being changed, automatically calculate profit_days and loss_days
//         if (name === 'pnl') {
//             const pnlValue = parseFloat(value) || 0;
//             updatedFormData.profit_days = pnlValue > 0 ? 1 : 0;
//             updatedFormData.loss_days = pnlValue < 0 ? 1 : 0;
//         }

//         setFormData(updatedFormData);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Simple validation
//         if (!formData.name || !formData.pnl || !formData.capital_invested) {
//             alert('Please fill in all fields');
//             return;
//         }

//         // Determine profit_days and loss_days based on pnl
//         const pnlValue = parseFloat(formData.pnl);
//         const profitDays = pnlValue > 0 ? 1 : 0;
//         const lossDays = pnlValue < 0 ? 1 : 0;

//         const newEntry = {
//             date: formData.date,
//             name: formData.name,
//             pnl: pnlValue,
//             trading_symbol: formData.trading_symbol,
//             capital_invested: parseFloat(formData.capital_invested),
//             profit_days: profitDays,
//             loss_days: lossDays,
//         };
//         console.log(newEntry)
//         try {
//             const response = await fetch(`${apiurl}/trade/entry`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(newEntry),
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             await response.json();

//             setIsModalOpen(false);
//         } catch (error) {
//             console.error('Error submitting data:', error);
//             alert('Failed to submit entry. Please try again later.');
//         }
//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-90 z-50">
//             <div className="bg-[#011f2c] rounded-lg shadow-xl w-full max-w-md px-1 border border-white">
//                 {/* <div className="flex justify-between items-center p-4 border-b">
//                     <h3 className="text-lg font-medium">Add New Entry</h3>
//                     <button onClick={handleCloseModal} className="text-gray-500 hover:text-white">
//                         X
//                     </button>
//                 </div> */}

//                 <div className="p-4">
//                     <div className="mb-3">
//                         <label className="block text-white text-sm font-medium mb-2" htmlFor="date">
//                             Date
//                         </label>
//                         <input
//                             type="date"
//                             id="date"
//                             name="date"
//                             value={formData.date}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded-lg"
//                             required
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label className="block text-white text-sm font-medium mb-2" htmlFor="name">
//                             Name
//                         </label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded-lg"
//                             required
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label className="block text-white text-sm font-medium mb-2" htmlFor="pnl">
//                             PnL
//                         </label>
//                         <input
//                             type="number"
//                             id="pnl"
//                             name="pnl"
//                             value={formData.pnl}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded-lg"
//                             step="0.01"
//                             required
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label className="block text-white text-sm font-medium mb-2" htmlFor="trading_symbol">
//                             Trading Symbol
//                         </label>
//                         <input
//                             type="text"
//                             id="trading_symbol"
//                             name="trading_symbol"
//                             value={formData.trading_symbol}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded-lg"
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <label className="block text-white text-sm font-medium mb-2" htmlFor="capital_invested">
//                             Price Traded
//                         </label>
//                         <input
//                             type="number"
//                             id="capital_invested"
//                             name="capital_invested"
//                             value={formData.capital_invested}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border rounded-lg"
//                             step="0.01"
//                             required
//                         />
//                     </div>

//                     <div className='flex items-center gap-5 justify-center'>
//                         <div className="mb-3">
//                             <label className="block text-white text-sm font-medium mb-2" htmlFor="profit_days">
//                                 Profit Days
//                             </label>
//                             <input
//                                 type="number"
//                                 id="profit_days"
//                                 name="profit_days"
//                                 value={formData.profit_days || 0}
//                                 onChange={handleInputChange}
//                                 className="w-full p-2 border rounded-lg"
//                                 step="1"
//                                 required
//                                 readOnly
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label className="block text-white text-sm font-medium mb-2" htmlFor="loss_days">
//                                 Loss Days
//                             </label>
//                             <input
//                                 type="number"
//                                 id="loss_days"
//                                 name="loss_days"
//                                 value={formData.loss_days || 0}
//                                 onChange={handleInputChange}
//                                 className="w-full p-2 border rounded-lg"
//                                 step="1"
//                                 required
//                                 readOnly
//                             />
//                         </div>
//                     </div>

//                     <div className="flex justify-end pt-4">
//                         <button
//                             type="button"
//                             onClick={handleCloseModal}
//                             className="mr-2 px-4 py-1 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="button"
//                             onClick={handleSubmit}
//                             className="px-4 py-1 bg-[#307c9f] text-white rounded-lg cursor-pointer"
//                         >
//                             Add Entry
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TableModal;

import React from 'react';

const apiurl = import.meta.env.VITE_REACT_APP_SERVER_URL;

const TableModal = ({ setIsModalOpen, formData, setFormData }) => {
    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };

        if (name === 'pnl') {
            const pnlValue = parseFloat(value) || 0;
            updatedFormData.profit_days = pnlValue > 0 ? 1 : 0;
            updatedFormData.loss_days = pnlValue < 0 ? 1 : 0;
        }

        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.pnl || !formData.capital_invested) {
            alert('Please fill in all fields');
            return;
        }

        const pnlValue = parseFloat(formData.pnl);
        const profitDays = pnlValue > 0 ? 1 : 0;
        const lossDays = pnlValue < 0 ? 1 : 0;

        const newEntry = {
            date: formData.date,
            name: formData.name,
            pnl: pnlValue,
            trading_symbol: formData.trading_symbol,
            capital_invested: parseFloat(formData.capital_invested),
            profit_days: profitDays,
            loss_days: lossDays,
        };

        try {
            const response = await fetch(`${apiurl}/trade/entry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEntry),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            await response.json();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Failed to submit entry. Please try again later.');
        }
    };

    return (
            <div className="bg-transparent border-white/20 rounded-2xl shadow-2xl p-4 w-full max-w-md text-white">
                {/* <h2 className="text-lg font-semibold mb-4 text-center">Add New Trade Entry</h2> */}

                <form onSubmit={handleSubmit}>
                    {[
                        { label: "Date", type: "date", name: "date" },
                        { label: "Name", type: "select", name: "name", options: ["Shubham", "Naeem", "Ujjawal", "Priyadarshi", "Naman",] },
                        { label: "PnL", type: "number", name: "pnl", step: "0.01" },
                        { label: "Trading Symbol", type: "text", name: "trading_symbol" },
                        { label: "Price Traded", type: "number", name: "capital_invested", step: "0.01" },
                        ].map(({ label, type, name, step, options }) => (
                        <div className="mb-4" key={name}>
                            <label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label>
                            {type === "select" ? (
                            <select
                                name={name}
                                value={formData[name] || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-1 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            >
                                <option value="">Select Trader</option>
                                {options.map((option, index) => (
                                <option className='text-gray-950 font-normal' key={index} value={option}>
                                    {option}
                                </option>
                                ))}
                            </select>
                            ) : (
                            <input
                                type={type}
                                name={name}
                                value={formData[name] || ''}
                                onChange={handleInputChange}
                                step={step}
                                className="w-full px-4 py-1 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            )}
                        </div>
                    ))}

                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Profit Days</label>
                            <input
                                type="number"
                                name="profit_days"
                                value={formData.profit_days || 0}
                                readOnly
                                className="w-full px-4 py-1 rounded-lg bg-gray-100 text-gray-700"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Loss Days</label>
                            <input
                                type="number"
                                name="loss_days"
                                value={formData.loss_days || 0}
                                readOnly
                                className="w-full px-4 py-1 rounded-lg bg-gray-100 text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition text-white shadow-md"
                        >
                            Add Entry
                        </button>
                    </div>
                </form>
            </div>
    );
};

export default TableModal;

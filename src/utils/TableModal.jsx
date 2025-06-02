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

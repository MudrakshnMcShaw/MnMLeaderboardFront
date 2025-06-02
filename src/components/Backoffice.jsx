import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradingTable from '../utils/TradingTable';
import { Toaster, toast } from 'sonner';

const apiurl = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Backoffice = () => {
    const [tableData, setTableData] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rerender, setRerender] = useState(false);
    const [top3, setTop3] = useState([]);

    useEffect(() => {
        (async() => {
            try {
            // setLoading(true);
            const response = await axios.get(`${apiurl}/trade`);
            if (response.status === 200) {
                if(rerender) toast.success('Data Refreshed successfully');
            }
            const data = response.data;
            const sortedData = [...data].sort((a, b) => b.pnl - a.pnl);
            const top3 = sortedData.slice(0, 3);
            setTop3(top3);
            setTableData(data);
            // console.log(data)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again later.');
        } 
        })()
    }, [rerender]);


    return (
        <div className="w-full h-screen">
            <Toaster position="bottom-right" richColors={true} />
                <TradingTable data={tableData} top3={top3} setRerender={setRerender}/>
        </div>
    );
};

export default Backoffice
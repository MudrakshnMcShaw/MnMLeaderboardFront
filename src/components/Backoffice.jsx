import React, { useState, useEffect } from 'react';
import { BackofficeTable } from '..';
import axios from 'axios';
import TradingTable from '../utils/TradingTable';
import { Toaster, toast } from 'sonner';

const apiurl = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Backoffice = () => {
    const [tableData, setTableData] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        (async() => {
            try {
            // setLoading(true);
            const response = await axios.get(`${apiurl}/trade`);
            if (response.status === 200) {
                if(rerender) toast.success('Data Refreshed successfully');
            }
            const data = response.data;
            setTableData(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again later.');
        } 
        })()
    }, [rerender]);


    return (
        <div className="w-full h-screen">
            <Toaster position="bottom-right" richColors={true} />
                <TradingTable data={tableData} setRerender={setRerender}/>
        </div>
    );
};

export default Backoffice
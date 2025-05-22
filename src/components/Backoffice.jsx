import React, { useState, useEffect } from 'react';
import { BackofficeTable } from '..';

const apiurl = import.meta.env.VITE_REACT_APP_SERVER_URL;

const Backoffice = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/trade`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTableData(data);
            // console.log(data)
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div className="w-full h-screen">
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500 h-full ">{error}</div>
            ) : (
                <BackofficeTable data={tableData} />
            )}
        </div>
    );
};

export default Backoffice
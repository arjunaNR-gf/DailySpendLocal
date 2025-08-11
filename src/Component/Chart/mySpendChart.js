import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './myspendChart.css'

const data = [
    { name: 'Hotel', value: 400 },
    { name: 'Transport', value: 300 },
    { name: 'Shopping', value: 300 },
    { name: 'Entertainment', value: 200 },
    { name: 'Snacks', value: 399 },
    { name: 'Family', value: 399 },
    {name:'Merchant', value: 323}

];

const COLORS = ['#0088FE', '#00C49F', '#edc05fff', '#fe9c6bff'];

const DailySpendPieChart = ({dataval}) => {
    const[datastr,setdataStr] = useState([])
    useEffect(()=>{
        setdataStr(dataval)
    },[dataval])
    return (
        <div className='spendChart'>
            <PieChart width={400} height={300}>
                <Pie
                    data={datastr}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label

                >
                    {datastr.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index %3   ]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
};

export default DailySpendPieChart;

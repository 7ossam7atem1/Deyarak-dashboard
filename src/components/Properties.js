import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import '../css/Properties.css';

const Properties = () => {
  const [propertyStats, setPropertyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPropertyStats = async () => {
      try {
        const response = await axios.get(
          'https://deyarak-app.onrender.com/api/v1/properties/property-stats'
        );
        setPropertyStats(response.data.data.stats);
        setLoading(false);
      } catch (error) {
        setError('Error fetching property stats');
        setLoading(false);
      }
    };

    fetchPropertyStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const COLORS = [
    '#8884d8',
    '#8dd1e1',
    '#82ca9d',
    '#a4de6c',
    '#d0ed57',
    '#ffc658',
  ];

  const renderLineChart = (data, dataKey) => (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          dataKey={dataKey}
          stroke='#8884d8'
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = (data, dataKey) => (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill='#82ca9d' />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = (data) => (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4'>Property Stats</h2>
      {propertyStats.length > 0 &&
        propertyStats.map((stat, index) => (
          <div key={index}>
            <h3>{stat.category}</h3>
            <div className='row'>
              <div className='col-lg-4 mb-4'>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>Price (EGP)</h5>
                    {renderLineChart(
                      [
                        { name: 'Min', value: stat.minPrice },
                        { name: 'Average', value: stat.averagePrice },
                        { name: 'Max', value: stat.maxPrice },
                      ],
                      'value'
                    )}
                  </div>
                </div>
              </div>
              <div className='col-lg-4 mb-4'>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>Size (sqm)</h5>
                    {renderBarChart(
                      [
                        { name: 'Min', value: stat.minSize },
                        { name: 'Average', value: stat.averageSize },
                        { name: 'Max', value: stat.maxSize },
                      ],
                      'value'
                    )}
                  </div>
                </div>
              </div>
              <div className='col-lg-4 mb-4'>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>Number of Rooms</h5>
                    {renderLineChart(
                      [{ name: 'Average', value: stat.averageRooms }],
                      'value'
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-lg-6 mb-4'>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>Number of Bathrooms</h5>
                    {renderBarChart(
                      [{ name: 'Average', value: stat.averageBathrooms }],
                      'value'
                    )}
                  </div>
                </div>
              </div>
              <div className='col-lg-6 mb-4'>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>Price per Square Meter (EGP)</h5>
                    {renderLineChart(
                      [
                        {
                          name: 'Average',
                          value: stat.averagePricePerSquareMeter,
                        },
                      ],
                      'value'
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col-lg-12 mb-4'>
                <div className='card'>
                  <div className='card-body'>
                    <h5 className='card-title'>Addresses</h5>
                    {renderPieChart(
                      stat.uniqueAddresses.map((address, i) => ({
                        name: address,
                        value: 1,
                        color: COLORS[i % COLORS.length],
                      }))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Properties;

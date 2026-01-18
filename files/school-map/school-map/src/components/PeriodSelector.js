import React from 'react';

const PeriodSelector = ({ currentPeriod, onPeriodChange }) => {
  const periods = [
    'Period 1',
    'Period 2',
    'Period 3',
    'Period 4',
    'Period 5',
    'Period 6'
  ];

  return (
    <div className="selector">
      <label htmlFor="period-select">Period</label>
      <select 
        id="period-select"
        value={currentPeriod} 
        onChange={(e) => onPeriodChange(e.target.value)}
      >
        {periods.map(period => (
          <option key={period} value={period}>
            {period}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeriodSelector;

import React from 'react'
import {
   Cell, PieChart, Pie, Tooltip
  } from 'recharts';

  import CustomTooltip from './CustomTooltip'
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


/**
Responsible for containing the data viz's for a given survey Q&A.
**/
class Results_PieChart extends React.Component{

    constructor(props){

        super(props)
    }

    render(){

        var {data} = this.props
	
       return <PieChart width={350} height={250}>
                <Pie
                    data={data}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    fill="#8884d8"
                    dataKey="amount"
                >
                  
                    {
                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                </PieChart>
    }
}

Results_PieChart.defaultProps = {

    data: {},
    seriesColors: []
}

export default Results_PieChart
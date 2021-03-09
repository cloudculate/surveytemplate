import React from 'react'

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
  } from 'recharts';

import CustomTooltip from './CustomTooltip'

/**
Responsible for containing the data viz's for a given survey Q&A.
**/
class Results_BarChart extends React.Component{

    constructor(props){

        super(props)
    }

    render(){

        var {data, seriesColors} = this.props
	
       return <BarChart
                width={350}
                height={250}
                data={data}
                margin={{
                    top: 0, right: 0, left: 0, bottom:0,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis allowDecimals={false}/>
                <Tooltip content={<CustomTooltip />} />
                {data.map(function(val, ix){

                    return <Bar dataKey={val.seriesName} stackId="a" fill={seriesColors[ix]} />
                })} 
                </BarChart>
    }
}

Results_BarChart.defaultProps = {
    data: {},
    seriesColors:[]
}

export default Results_BarChart
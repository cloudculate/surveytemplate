import React from 'react'
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip
  } from 'recharts';
  import CustomTooltip from './CustomTooltip'
/**
Responsible for containing the data viz's for a given survey Q&A.
**/
class Results_RadarChart extends React.Component{

    constructor(props){

        super(props)
    }

    render(){

        var {data} = this.props

        if(data.length < 3){
            return <div className="disabledquestion">Sorry, at least 2 data points are needed to view the radar chart.</div>
        }
	
       return <RadarChart width={350} height={250} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name"/>
                <PolarRadiusAxis allowDecimals={false}/>
                <Radar name="Mike" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                
                <Tooltip content={<CustomTooltip />} />
            </RadarChart>
    }
}

Results_RadarChart.defaultProps = {

    data: {},
    seriesColors: []
}

export default Results_RadarChart
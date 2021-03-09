import React from 'react'

/**
Responsible for containing the data viz's for a given survey Q&A.
**/
class Results_TableChart extends React.Component{

    constructor(props){

        super(props)
    }

    render(){

      var {data} = this.props
	
       return <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Answer</th>
                    <th scope="col">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(function(val){
                    return <tr>
                    <td>{val.seriesName}</td>
                    <td>{val.amount}</td>
                  </tr>
                  })}
                </tbody>
              </table>
    }
}

Results_TableChart.defaultProps = {

    data: [],
    seriesColors: []
}

export default Results_TableChart
import React from 'react'
import Results_BarChart from './Results_BarChart'
import Results_PieChart from './Results_PieChart'
import Results_RadarChart from './Results_RadarChart'
import Results_TableChart from './Results_TableChart'

/**
Responsible for containing the data viz's for a given survey Q&A.
**/
class QnACard extends React.Component{

    constructor(props){

        super(props)

        this.state = {
            chartType:"bar"
        }

        this.handleChangeChartTypeClicked = this.handleChangeChartTypeClicked.bind(this)
    }

    handleChangeChartTypeClicked(e){

        var chartType = e.currentTarget.dataset["charttype"]

        this.setState(()=>({
            chartType: chartType
        }))
    }
    
    getDataVisualizationPiece(){

      var {question} = this.props
      var {chartType} = this.state
      var retVis
      var chartData  = this.buildChartDataFromQuestion(question)
      var seriesColors = ['#0072B2',
        '#F0E442',
        '#56B4E9',
        '#009E73',
        '#E69F00',
        '#D55E00',
        '#CC79A7']

      switch(chartType){

        case "bar":
          retVis = <Results_BarChart data={chartData} seriesColors={seriesColors}/>
          break
        case "pie":
          retVis = <Results_PieChart data={chartData} seriesColors={seriesColors}/>
          break
        case "radar":
          retVis = <Results_RadarChart data={chartData} seriesColors={seriesColors}/>
          break
        case "table":
          retVis = <Results_TableChart data={chartData} seriesColors={seriesColors}/>
          break
                          
      }

      return retVis
    }

    buildChartDataFromQuestion(question){

      var retChartData = [/*{
        name: 'Page A', amount: 4000
      }*/]

      var answerIdsCounts = question.answers.answerIdsCounts
      var dataSeriesName = ""
      var dataRec
      for(var answerId in answerIdsCounts){

        dataSeriesName = this.getPossibleAnswerTextByAnswerId(question, answerId)

        dataRec = {
          name: dataSeriesName.substr(0, 10), amount: answerIdsCounts[answerId]
        }

        dataRec.seriesName = dataSeriesName
        dataRec[dataSeriesName] = dataRec.amount

        retChartData.push(dataRec)
      }

      return retChartData
    }

    getPossibleAnswerTextByAnswerId(question, answerId){

      var result = question.possibleAnswers.filter(answer => {
        return answer.id === answerId
      })

      if(result){

        result = result[0].answer
      }
      else{

        result = ""
      }

      return result
    }

    hasEnoughDataForRadar(){

      return true
    }

    getTopAnswersText(){

      var that = this
      var {question} = this.props
      var retHtml = []
      var {surveyDefWithAnswers} = this.props

      retHtml.push(<strong className="yourResponseColor">Your Answer</strong>)
      retHtml.push(<p className="yourResponseColor twelveFont">{this.getPossibleAnswerTextByAnswerId(question, question.answers.myResponseAnswerId)}</p>)

      retHtml.push(<strong>Top Answer(s)</strong>)

      var topAnswers = question.answers.topAnswers.map(function(answerIdToCount){

        return <p className="twelveFont">{that.getPossibleAnswerTextByAnswerId(question, answerIdToCount.answerId)}</p>
      })

      topAnswers = topAnswers.slice(0, 2)

      retHtml = retHtml.concat(topAnswers)

      return retHtml
    }

    render(){

      var {chartType} = this.state
        var {question} = this.props

       return <div className="row kpicardholder">
                <div className="col-md-12">
                  <h6>Question</h6>
                  <p className="twelveFont">{question.question}</p>
                  {this.getTopAnswersText()}
                </div>
                <div className="col-md-2 chartTypeButtonBar btn-group btn-group-toggle btn-group-vertical" data-toggle="buttons">
                      <button data-charttype="bar" className={"btn barsButton " + (chartType === "bar" ? "active" : "secondary")} onClick={this.handleChangeChartTypeClicked}></button>
                      <button data-charttype="pie" className={"btn pieButton " + (chartType === "pie" ? "active" : "secondary")} onClick={this.handleChangeChartTypeClicked}></button>
                      {this.hasEnoughDataForRadar() === false ? "" : <button data-charttype="radar" className={"btn radarButton " + (chartType === "radar" ? "active" : "secondary")} onClick={this.handleChangeChartTypeClicked}></button>}
                      <button data-charttype="table" className={"btn tableButton " + (chartType === "table" ? "active" : "secondary")} onClick={this.handleChangeChartTypeClicked}></button>
                      
                  </div>
                  <div className="col-md-10 twelveFont">
                  {this.getDataVisualizationPiece()}
                  </div>
              </div>
    }
}

QnACard.defaultProps = {

    question: {},
    surveyDefWithAnswers:{}
}

export default QnACard
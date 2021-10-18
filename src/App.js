import React from "react";
import {
  BrowserRouter as Router
} from "react-router-dom";
import Survey_Take from "./Survey_Take";
import SurveyResults from './SurveyResults'

class App extends React.Component{

  constructor(props){

    super(props)

    this.state = {
      
      respondentUid:"",
      surveyInfo:{
        apiKey:"",
        appKey:"",
        definitionUid:"",
        responsesUid:"",
        mode: ""//take||responses
      },
      userInfo: {}
    }

    this.handleGotResultsUid = this.handleGotResultsUid.bind(this)
    this.handleGotUserContactInfo = this.handleGotUserContactInfo.bind(this)
    this.handleSurveyCompleted = this.handleSurveyCompleted.bind(this)
  }

  handleSurveyCompleted(){
    
    var {surveyInfo} = this.state
    surveyInfo.mode = "responses"

      this.setState(()=>({

        surveyInfo: surveyInfo
      }))
  }

  handleGotUserContactInfo(userInfo){

    this.setState(()=>({

      userInfo: userInfo
    }))
  }

  handleGotResultsUid(uid){

    this.setState(()=>({

      respondentUid: uid
    }))
  }

  componentDidMount(){

    var url_string = window.location.href
    var url = new URL(url_string)

    var respondentUid = ""

    var {surveyInfo, userInfo} = this.state
    surveyInfo.apiKey = url.searchParams.get("api_key")
    surveyInfo.appKey = url.searchParams.get("app_key")
    surveyInfo.definitionUid = url.searchParams.get("sid")
    surveyInfo.responsesUid = url.searchParams.get("sid")
    surveyInfo.mode = url.searchParams.get("mode")

    if(surveyInfo.mode === "responses"){

      if(url.searchParams.get("respondent_uid") != null){

        respondentUid = url.searchParams.get("respondent_uid")
      }

      userInfo.email = ""
      if(url.searchParams.get("respondent_email") != null){

        userInfo.email = url.searchParams.get("respondent_email")
      }

      this.setState(()=>({

        respondentUid: respondentUid,
        userInfo: userInfo,
        surveyInfo: surveyInfo
      }))
    }
    else{

      this.setState(()=>({

        surveyInfo: surveyInfo
      }))
    }
    
  }

  render(){

    var {respondentUid, userInfo, surveyInfo} = this.state

     /* return <div>

         {surveyInfo.mode === "take" ? <Survey_Take
               svcUrl={"http://localhost:8080"}
               definitionUid={surveyInfo.definitionUid}
               writeResultsUid={surveyInfo.responsesUid}
               handleGotMyResultsUid={this.handleGotResultsUid}
               handleGotUserContactInfo={this.handleGotUserContactInfo}
               handleSurveyCompleted={this.handleSurveyCompleted}
               resultsRedirectPath="results"
               apiKey={surveyInfo.apiKey}
               appKey={surveyInfo.appKey}
             /> : ""}

       {surveyInfo.mode === "responses" ? <SurveyResults 
               svcUrl={"http://localhost:8080"}
               email={userInfo.email}
               rspkey={respondentUid}
               definitionUid={surveyInfo.definitionUid}
               resultsUid={surveyInfo.responsesUid}
               apiKey={surveyInfo.apiKey}
               appKey={surveyInfo.appKey}
               /> : ""}
       </div>  */

    return (
        <Router basename="/surveys">
        <div>

          {surveyInfo.mode === "take" ? <Survey_Take
                svcUrl={"https://cloudculateapi.com"}
                definitionUid={surveyInfo.definitionUid}
                writeResultsUid={surveyInfo.responsesUid}
                handleGotMyResultsUid={this.handleGotResultsUid}
                handleGotUserContactInfo={this.handleGotUserContactInfo}
                handleSurveyCompleted={this.handleSurveyCompleted}
                apiKey={surveyInfo.apiKey}
                appKey={surveyInfo.appKey}
              /> : ""}

        {surveyInfo.mode === "responses" ? <SurveyResults 
                svcUrl={"https://cloudculateapi.com"}
                email={userInfo.email}
                rspkey={respondentUid}
                definitionUid={surveyInfo.definitionUid}
                resultsUid={surveyInfo.responsesUid}
                apiKey={surveyInfo.apiKey}
                appKey={surveyInfo.appKey}
                /> : ""}
        </div>
       </Router>
    )
  }
}

export default App
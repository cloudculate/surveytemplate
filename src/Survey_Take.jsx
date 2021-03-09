import React from 'react'
import PhoneCountryCodes from './PhoneCountryCodesList';
const axios = require('axios');

class Survey_Take extends React.Component{

    constructor(props){

        super(props)

        this.state = {
          readyToTakeSurvey: false,
          userInfo: { email: "", firstName:"", lastName:"", phone:"", geoLocation:"" },
          surveyDef: null,
          questionIdsToAnswers: {},
          questionIdsToAnswerIds: {},
          sectionIdsToAdditionalComments: {},
          previouslyAnsweredQuestionIx: -1
        }

        this._autoScrollToNextQuestion = false
        this.handleCompleteSurveyClicked = this.handleCompleteSurveyClicked.bind(this)
        this.handleAnswerGiven = this.handleAnswerGiven.bind(this)
        this.handleAnswerSelectListChanged = this.handleAnswerSelectListChanged.bind(this)
        this.handleAnswerButtonBarClicked = this.handleAnswerButtonBarClicked.bind(this)
        this.handleAdditionalCommentsChanged = this.handleAdditionalCommentsChanged.bind(this)
        this.userInfoChanged = this.userInfoChanged.bind(this)
        this.phoneChanged = this.phoneChanged.bind(this)
        this.handleSubmitContactInfoClicked = this.handleSubmitContactInfoClicked.bind(this)
    }

    handleCompleteSurveyClicked(){

      var that = this

      var handleCompleteSurveyClickedActual = function(geoPosition){

        var {userInfo, surveyDef, questionIdsToAnswerIds, sectionIdsToAdditionalComments} = that.state
        userInfo.geoLocation = geoPosition

        var retResponses = [[surveyDef.respondentUid, userInfo.email, JSON.stringify(questionIdsToAnswerIds), JSON.stringify(sectionIdsToAdditionalComments), JSON.stringify(userInfo)]]

        axios.post(that.props.svcUrl + "/CaptureSurveyResponse",  
                  {
                    "uid": that.props.writeResultsUid,
                    "api_key":that.props.apiKey,
                    "app_key":that.props.appKey,
                    "input":[{
                      "address":"A2:E50000",
                      "sheetName":"UserResponses",
                      "value": retResponses}]
                  }
        ).then(function (response) {

          that.props.handleSurveyCompleted()
        })
        .catch(function (error) {

          console.log(error)
        })
      }

      this.getLocation(handleCompleteSurveyClickedActual)
    }

    getLocation(callback) {

      if (navigator.geolocation){

        return navigator.geolocation.getCurrentPosition(function(geoPosition){

          callback(geoPosition.coords.latitude + "," + geoPosition.coords.longitude)
        })
      } 
      else {

        callback("Geolocation is not supported by this browser.")
      }
    }

    handleSubmitContactInfoClicked(){

      var {userInfo} = this.state
      var readyToTakeSurvey = true

      if(this.validateEmail(userInfo.email) === false || userInfo.firstName === "" || userInfo.lastName === "" || userInfo.phone === ""){

        readyToTakeSurvey = false
      }

      this.props.handleGotUserContactInfo(userInfo)
      
      this.setState(()=>({

        readyToTakeSurvey: readyToTakeSurvey
      }))
    }

    phoneChanged(phoneNumber){

      var {userInfo} = this.state

      userInfo["phone"] = phoneNumber
      this.setState(()=>({

        userInfo: userInfo
      }))
    }

    userInfoChanged(e){

      var {userInfo} = this.state

      var propName = e.currentTarget.dataset["propname"]
      userInfo[propName] = e.currentTarget.value

      this.setState(()=>({

        userInfo: userInfo
      }))
    }

    validateEmail(email){
      
        var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(email.match(mailformat)){

          return true
        }
        else{

          return false
        }
    }

    handleAdditionalCommentsChanged(e){

      var {sectionIdsToAdditionalComments} = this.state

      var sectionId = e.currentTarget.dataset["sectionid"]

      sectionIdsToAdditionalComments[sectionId] = e.currentTarget.value

      this.setState(()=>({

        sectionIdsToAdditionalComments: sectionIdsToAdditionalComments
      }))
    }

    handleAnswerButtonBarClicked(e){

      var questionId = e.currentTarget.dataset["questionid"]
      var answer = e.currentTarget.dataset["answer"]
      var answerId = e.currentTarget.dataset["answerid"]
      var questionix = parseInt(e.currentTarget.dataset["questionix"])
      this.handleAnswerGiven(questionId, answer, answerId, questionix)
    }

    handleAnswerSelectListChanged(e){

      var questionId = e.currentTarget.selectedOptions[0].dataset["questionid"]
      var answer = e.currentTarget.selectedOptions[0].dataset["answer"]
      var answerId = e.currentTarget.selectedOptions[0].dataset["answerid"]
      var questionix = parseInt(e.currentTarget.selectedOptions[0].dataset["questionix"])
      this.handleAnswerGiven(questionId, answer, answerId, questionix)
    }
    
    handleAnswerGiven(questionId, answer, answerId, questionix){

      this._autoScrollToNextQuestion = true

      var {questionIdsToAnswers, questionIdsToAnswerIds} = this.state

      questionIdsToAnswers[questionId] = answer
      questionIdsToAnswerIds[questionId] = answerId
     
      this.setState(()=>({

        questionIdsToAnswers: questionIdsToAnswers,
        questionIdsToAnswerIds: questionIdsToAnswerIds,
        previouslyAnsweredQuestionIx: parseInt(questionix)
      }))
    }

    getToggleButtonsBar(question, possibleAnswers, qIx){

      var that = this
      var {questionIdsToAnswers} = this.state

      return <div className="btn-group" role="group">
              {possibleAnswers.map((function(possibleAnswer, ix){

                var selectedClassName = "btn-secondary"
                if(questionIdsToAnswers[question.id] && questionIdsToAnswers[question.id] === possibleAnswer.answer){

                  selectedClassName = "btn-primary"
                }

                var label = possibleAnswer.answer
                var strParts = possibleAnswer.answer.split("=")
                if(strParts.length > 0){

                  label = strParts[0].trim()
                }
                
                return <button 
                          onClick={that.handleAnswerButtonBarClicked} 
                          className={"btn surveybuttonbarbutton " + selectedClassName} 
                          data-questionid={question.id}
                          data-questionix={qIx}
                          data-answerid={possibleAnswer.id}
                          data-answer={possibleAnswer.answer}>{label}</button>
              }))}
            </div>
    }

    getQuestionUIControlType(question, qIx, totalNumQuestions){

      var that = this

      var {questionIdsToAnswers, previouslyAnsweredQuestionIx} = this.state
      var retUiCtrl

      var possibleAnswers = question.possibleAnswers

      switch(question.questionUIControlType){
        case "selectlist":
          retUiCtrl =  <select className="form-control" onChange={that.handleAnswerSelectListChanged} >
                          <option  
                                          data-questionid={""} 
                                          data-questionix={qIx}
                                          data-answer={""} 
                                          data-answerid={0} 
                                          >{""}</option>
                        {possibleAnswers.map((function(possibleAnswer, answerIx){

                          return <option  
                                          data-questionid={question.id} 
                                          data-questionix={qIx}
                                          data-answer={possibleAnswer.answer} 
                                          data-answerid={possibleAnswer.id} 
                                          >{possibleAnswer.answer}</option>
                        }))}
                       </select>
          break
        case "textarea":
          retUiCtrl = <textarea onChange={this.handleAnswerGiven}></textarea>
          break
        case "togglebuttonsbar":
          retUiCtrl = this.getToggleButtonsBar(question, possibleAnswers, qIx)
          break
        case "radiobutton":
          <select>
            {possibleAnswers.map((function(item, ix){return item}))}
          </select>
          break
        case "checkbox":
          <select>
            {possibleAnswers.map((function(item, ix){return item}))}
          </select>
          break
        case "textinput":
          <select>
            {possibleAnswers.map((function(item, ix){return item}))}
          </select>
          break
      }

      var enabledClass = "disabledquestion"
      var arrQuestionIds = []
      for(var qid in questionIdsToAnswers){
        arrQuestionIds.push(parseInt(qid))
      }

      var maxQuestionIx = totalNumQuestions

      if(qIx === 0 || questionIdsToAnswers[question.id] != null || ((previouslyAnsweredQuestionIx+1) === qIx)){

        enabledClass = "enabledquestion"
      }
      else if(qIx === maxQuestionIx){

        enabledClass = "enabledquestion"
      }

      return <div className={"question_holder " + enabledClass} id={"qholder" + qIx}>
              <p>{question.question}</p>
              {retUiCtrl}
            </div>
    }

    getQuestions(){

      var that = this
      axios.post(this.props.svcUrl + "/GetSurveyDefinition",  
                {
                  "uid": this.props.definitionUid,
                  "api_key":this.props.apiKey,
                  "app_key":this.props.appKey
                }
      ).then(function (response) {

        var surveyDef = response.data.content[0].output_param_surveydef

          that.props.handleGotMyResultsUid(surveyDef.respondentUid)

          that.setState(()=>({
            surveyDef: surveyDef
          }))
      })
      .catch(function (error) {

        console.log(error)
      })
    }

    getTotalNumberOfQuestions(){

      var {surveyDef} = this.state

      var totalNumQuestions = 0

      surveyDef.sections.map(function(section, sectionIx){

        totalNumQuestions += section.questions.length
      })

      return totalNumQuestions
    }

    componentDidUpdate(){

      var {previouslyAnsweredQuestionIx} = this.state

      if(this._autoScrollToNextQuestion === false){

        return
      }

      this._autoScrollToNextQuestion = false

      if(previouslyAnsweredQuestionIx > -1){

        var element = document.getElementById("qholder" + parseInt(previouslyAnsweredQuestionIx + 1))
        if(!element){

          return
        }
        
        window.scrollTo(0, element.offsetTop - 50)
      }
    }

    componentDidMount(){

      this.getQuestions()
    }

    render(){

      var that = this

      var {surveyDef, userInfo, readyToTakeSurvey} = this.state

      if(!surveyDef){

        return ""
      }

      if(readyToTakeSurvey === false){

        return <div className="surveycontainer my-4">
          <img className="surveylogo" src={surveyDef.header}></img>
          <h1>{surveyDef.name}</h1>
          <strong>If you would like to view your responses compared with other respondent's, please copy the ID and save it. It will not be provided again, once the survey has been completed. </strong>
          <div className="my-3"><i>{surveyDef.respondentUid}</i></div>
          <button className="btn btn-copy my-3 p-2" onClick={() => {navigator.clipboard.writeText(surveyDef.respondentUid);alert("copied!")}}>Copy My ID</button>
          <h3 className="my-2">Please Provide Your Contact Information for the Survey.</h3>
          <h6>*Email</h6>
          <input data-propname="email" type="email" value={userInfo.email} onChange={this.userInfoChanged} className={"my-2 ticontactinfo " + (this.validateEmail(userInfo.email) === false ? "tiwarning" : "tigood")}></input>
          <h6>*First Name</h6>
          <input data-propname="firstName" type="text" value={userInfo.firstName} onChange={this.userInfoChanged} className={"my-2 ticontactinfo " + (userInfo.firstName === "" ? "tiwarning" : "tigood")}></input>
          <h6>*Last Name</h6>
          <input data-propname="lastName" type="text" value={userInfo.lastName} onChange={this.userInfoChanged} className={"my-2 ticontactinfo " + (userInfo.lastName === "" ? "tiwarning" : "tigood")}></input>
          <h6>*Phone</h6>
          <PhoneCountryCodes handlePhoneChanged={this.phoneChanged}/>
          <p/>
          <button className="btn btn-save my-3 p-2" onClick={that.handleSubmitContactInfoClicked}>Start Survey</button>
          <div>{surveyDef.footer}</div>
        </div>
      }

      var {questionIdsToAnswers} = this.state
      var totalNumQuestions = this.getTotalNumberOfQuestions()
      var cumulativeQuestionIx = -1
      
      return <div className="surveycontainer my-4">
        <img className="surveylogo" src={surveyDef.header}></img>
        <h1>{surveyDef.name}</h1>
        <div className="my-2 surveydescription" dangerouslySetInnerHTML={{__html: surveyDef.description}}></div>
        <div className="my-2 surveyinstructions" dangerouslySetInnerHTML={{__html: surveyDef.instructions}}></div>
        {surveyDef.sections.map(function(section, sectionIx){

          var enableSectionFeedbackTextAreaClass = "enabledquestion"

          return <div className="survey_section">
                  <h3>{section.name}</h3>
                  {section.questions.map(function(question, qIx){

                    if(questionIdsToAnswers[question.id] == null){

                      enableSectionFeedbackTextAreaClass = "disabledquestion"
                    }

                    cumulativeQuestionIx++

                    return <div>
                            <div className="survey_question">{that.getQuestionUIControlType(question, cumulativeQuestionIx, totalNumQuestions)}</div>
                           </div>
                  })}

                  {sectionIx > 0 ? <div className={enableSectionFeedbackTextAreaClass}>
                    <br/>
                    <p>{"Additional Comments Regarding " + section.name}</p>
                    <textarea 
                                className={"taquestioncomments"} 
                                data-sectionid={section.id}
                                onChange={that.handleAdditionalCommentsChanged}
                                />
                      </div> : ""}
              </div>
          })}
          <p>
          <h2>After you submit your response, you'll be automatically redirected to see how you compare to other organizations in the same or other industries.</h2>
          </p>
          <button className="btn btn-save my-3 mx-5 p-2" onClick={that.handleCompleteSurveyClicked}>Submit My Response</button>
          
        <div>{surveyDef.footer}</div>
      </div>
    }
}

Survey_Take.defaultProps = {
  svcUrl:"",
  definitionUid:"",
  writeResultsUid:"",
  handleGotMyResultsUid: function(){},
  handleGotUserContactInfo: function(){},
  resultsRedirectPath: "results",
  apiKey:"",
  appKey:""
}

export default Survey_Take
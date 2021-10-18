import React from 'react'
import QnACard from './resultsviewer/QnACard'
const axios = require('axios');

class SurveyResults extends React.Component{

    constructor(props){

        super(props)

        this.state = {
            semail:"", 
            srspkey:"",
            surveyResponses: null,
            surveyDef:{},
            surveyDefWithAnswers:{}
        }

        this.handleEmailChanged = this.handleEmailChanged.bind(this)
        this.handleRespondentIdChanged = this.handleRespondentIdChanged.bind(this)
        this.handleGetMyResultsClicked = this.handleGetMyResultsClicked.bind(this)
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

    handleGetMyResultsClicked(){

        var {semail, srspkey} = this.state

        if(this.validateEmail(semail) === false || srspkey === ""){

           alert("Please provide a valid email address and Respondent ID")
           return
        }
        
        this.getResults(semail, srspkey)
        this.getSurveyDef()
    }

    handleEmailChanged(e){

        var email = e.currentTarget.value

        this.setState(()=>({
            semail: email
        }))
    }

    handleRespondentIdChanged(e){

        var rspkey = e.currentTarget.value

        this.setState(()=>({
            srspkey: rspkey
        }))
    }

    getQACards(){

        var retQACards = []

        var {surveyDefWithAnswers} = this.state

        surveyDefWithAnswers.sections.map(function(section){

            retQACards.push(<div className="col-md-12 my-4 sectionheaderresults"><h3>{section.name}</h3></div>)

            section.questions.map(function(question){
            
                retQACards.push( <div className="col-md-4 mb-3">
                    
                    <QnACard surveyDefWithAnswers={surveyDefWithAnswers}
                question={question}
            /></div>)
            })
        })

        return retQACards
    }

    getResults(email, rspkey){

        var that = this
        axios.post(this.props.svcUrl + "/GetSurveyResponses",  
                {
                    "email": email,
                    "key": rspkey,
                    "uid": this.props.resultsUid,
                    "api_key": this.props.apiKey,
                    "app_key": this.props.appKey
                }
        ).then(function (response) {

            var sResponses = response.data.content[0].output_param_surveyresponses

            if(sResponses[0] === "invalid respondent"){

                alert("Invalid Respondent ID or Email. Please Try Again.")
                return
            }

            that.setState(()=>({
                surveyResponses: sResponses
            }))

            that.populateAnswersToSurveyDefObject()
        })
        .catch(function (error) {

            console.log(error)
        })
    }

    getSurveyDef(){

        var that = this
        axios.post(this.props.svcUrl + "/GetSurveyDefinition",  
                    {
                    "uid": this.props.definitionUid,
                    "api_key": this.props.apiKey,
                    "app_key":this.props.appKey
                    }
        ).then(function (response) {
    
            that.setState(()=>({
                surveyDef: response.data.content[0].output_param_surveydef
            }))

            that.populateAnswersToSurveyDefObject()
        })
        .catch(function (error) {
    
            console.log(error)
        })
    }

    populateAnswersToSurveyDefObject(){

        var that = this

        var {surveyDef, surveyResponses, surveyDefWithAnswers} = this.state

        if(!surveyResponses || !surveyDef.sections){

            return
        }

        surveyDefWithAnswers = {...surveyDef}

        surveyDefWithAnswers.sections.map(function(section){

            section.questions.map(function(question){

                question.answers = surveyResponses[question.id]
            })
        })

        this.setState(()=>({
            surveyDefWithAnswers: surveyDefWithAnswers
        }))
    }

    getTotalNumberRespondents(){

        var numRespondents = 0
        var {surveyDefWithAnswers} = this.state

        surveyDefWithAnswers.sections.map(function(section){

            section.questions.map(function(question){
                
                if(question.answers.totalNumberOfResponses > numRespondents){

                    numRespondents = question.answers.totalNumberOfResponses
                }
            })
        })

        return numRespondents
    }

    componentDidMount(){

        var {email, rspkey} = this.props
        if(email === "" || rspkey === ""){

            return
        }

        this.getResults(email, rspkey)
        this.getSurveyDef()
    }

    render(){

        var {semail, srspkey, surveyResponses} = this.state

        var {email, rspkey} = this.props
        if(surveyResponses == null && (email === "" || rspkey === "")){
            
            return <div className="surveycontainer my-4">
            <h1>Please enter your email address and Respondent ID to view results</h1>
            <h6>*Email</h6>
            <input data-propname="email" type="text" value={semail} onChange={this.handleEmailChanged} className={"ticontactinfo mb-2 " + (this.validateEmail(semail) === false ? "tiwarning" : "tigood")}></input>
            <h6>*Respondent ID</h6>
            <input data-propname="respondentid" type="text" value={srspkey} onChange={this.handleRespondentIdChanged} className={"ticontactinfo " + (srspkey === "" ? "tiwarning" : "tigood")}></input>
            <p/>
            <button className="btn btn-save my-3 p-2" onClick={this.handleGetMyResultsClicked}>View Results</button>
            </div>
        }

        var {surveyResponses, surveyDefWithAnswers} = this.state
       
        if(!surveyResponses || !surveyDefWithAnswers.sections){

            return <div className="vcenter container">
                        <p/>
                        <div className="loaderProgressDiv center">
                                <p><h4>Please hold a second while we gather survey responses</h4></p>
                                <div className="loader"></div>
                        </div>
                    </div>
        }

      return <div className="surveycontainer my-4">
                <img className="surveylogo" src={surveyDefWithAnswers.header}></img>
                <p><strong>If you would like to view your responses compared with other respondent's, please copy the ID and save it. It will not be provided again, once the survey has been completed. </strong></p>
                <div className="my-3"><i>{this.props.rspkey}</i></div>
                <button className="btn btn-copy my-3 p-2" onClick={() => {navigator.clipboard.writeText(this.props.rspkey);alert("copied!")}}>Copy My ID</button>
                <h1>{surveyDefWithAnswers.name}</h1>
                <div className="my-2 surveydescription" dangerouslySetInnerHTML={{__html: surveyDefWithAnswers.description}}></div>
                <h2>{"Response Scale"}</h2>
                <div className="my-2 surveyinstructions" dangerouslySetInnerHTML={{__html: surveyDefWithAnswers.instructions.replace("For questions 2-5 below, please indicate your maturity level for each of the capabilities on a scale of 1-5.","")}}></div>
                <div id="surveyTitle"></div>
                <div id="surveyMetadata"></div>
                <h2><span class="yourResponseColor">{"Your Responses"}</span> {"vs. " + this.getTotalNumberRespondents() + " Others"}</h2>
                <div className="row">
                    {this.getQACards()}
                </div>
            </div>
    }
    
}

SurveyResults.defaultProps = {
    svcUrl:"",
    email:"",
    rspkey:"",
    definitionUid:"",
    resultsUid:"",
    apiKey:"",
    appKey:""
}

export default SurveyResults
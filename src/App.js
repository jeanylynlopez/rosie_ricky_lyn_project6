import React, { Component } from 'react';
// import './App.css';
// import './styles/partials/main.css'
import './partials/main.css'
import './questions.css'
import axios from "axios"; 
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import posed, { PoseGroup } from 'react-pose';

// ===============
// COMPONENTS
// ===============

import LandingPage from './LandingPage';
import StartingPage from './StartingPage';
import Players from './Players';
import Choice from "./Choice"
import Questions from './Questions';
import Results from "./Results"
import LeaderBoard from "./LeaderBoard"

const RouteContainer = posed.div({
  enter: { x: 0, opacity: 1, delay: 0, beforeChildren: true},
  exit: { x: 50, opacity: 0 }
});

class App extends Component {

  // setting state for the questions we get, the number of players, a promise, the players where each player is an object with their own stats, and the progress for each question 
  // what is the promise doing?
  // we can take out the difficulty and category state, right?
  constructor(){
    super();
    this.state = {
      questions: [],
      difficulty: "",
      category: "", 
      numberOfPlayers: "",
      promise:{},
      playerArray: [],
      questionProgress: 0,
      newQuestions: []
    }
  }

  // getting data from our API 
  getQuestions = (category, difficulty) => {

    this.setState({
      category: category,
      difficulty: difficulty
    })

    axios.get("https://opentdb.com/api.php?", {
      params: {
        amount: 50,
        category: category,
        difficulty: difficulty,
        // type: "multiple"
      }
    }).then(({ data }) => {
      
      // get each question in the original array 
      let questions = this.combineChoices(data.results);  
      // let filteringQuestions = this.filtering(data.results)
      // console.log(data.results);
      
      this.setState({
        questions,
        // newQuestions: emptyArray
      })

      // ===============
      // REGEX STUFF STARTS FOR QUESTIONS
      // ===============

      const doubleQuoteRegex = /(&quot;)+|(&ldquo)+|(&rdquo;)/g;
      const singleQuoteRegex = /(&#039;)/g;
      const ampersandRegex = /(&amp;)/g;

      // cloning and then mapping through each question 
      const clonedArayOne = Array.from(this.state.questions)
      const eachQuestion = clonedArayOne.map(question => question.question);

      // FILTERING EACH QUESTION
      let filteredArrayOne = [];
      let filtredQuestionsOne;
      eachQuestion.forEach((item) => {
        filtredQuestionsOne = item.replace(doubleQuoteRegex, '"');
        filtredQuestionsOne = filtredQuestionsOne.replace(singleQuoteRegex, "'");
        filtredQuestionsOne = filtredQuestionsOne.replace(ampersandRegex, "&")
        filteredArrayOne.push(filtredQuestionsOne)
      })

      for (let i = 0; i <= (clonedArayOne.length - 1); i++) {
        clonedArayOne[i].question = filteredArrayOne[i]
      }

       // FILTERING EACH CORRECT ANSWER WITH REGEX 
      let filtereCorrectAnswer = [];
      let filteredCorrectOne;
      // const clonedForRightAnswer = Array.from(this.state.questions);      
      const eachCorrectAnswer = clonedArayOne.map(answer => answer.correct_answer);

      // filtering through correct answers 
      eachCorrectAnswer.forEach((item) => {
        filteredCorrectOne = item.replace(doubleQuoteRegex, '"');
        filteredCorrectOne = filteredCorrectOne.replace(singleQuoteRegex, "'");
        filteredCorrectOne = filteredCorrectOne.replace(ampersandRegex, "&");
        filtereCorrectAnswer.push(filteredCorrectOne)
      })

      console.log(filteredCorrectOne);
      
      //// replace the correct answer in the questions object
      for (let i = 0; i <= (clonedArayOne.length - 1); i++){
        clonedArayOne[i].correct_answer = filtereCorrectAnswer[i]
      }

      // console.log('correct answers object ');
      // console.log(clonedArayOne)
      

      // // // replace the correct answer in the questions object
      // let clonedRightAnswer = Array.from(this.state.questions)
      // for (let i = 0; i <= (clonedRightAnswer.length - 1); i++){
      //   clonedRightAnswer[i].correct_answer = filteredCorrectAnd[i]
      // }


      // console.log("filtered individual correct answers oject")
      // console.log(clonedArayOne);
      

      // filtering through for single quotes
      // let filteredArrayTwo = [];
      // let filtredQuestionsTwo;
      // filteredArrayOne.forEach((item) => {
      //   filtredQuestionsTwo = item.replace(singleQuoteRegex, "'")
      //   filteredArrayTwo.push(filtredQuestionsTwo)
      // })

      // filtering through for &ampersands&
      // let filteredArrayThree = [];
      // let filtredQuestionsThree;
      // filteredArrayTwo.forEach((item) => {
      //   filtredQuestionsThree = item.replace(ampersandRegex, "&")
      //   filteredArrayThree.push(filtredQuestionsThree)
      // })

      // putting the filtered questions back 
      // let clonedArray = Array.from(this.state.questions);      
      // for (let i = 0; i <= (clonedArray.length - 1); i++){
      //   clonedArray[i].question = filteredArrayOne[i]
      // }

      // FILTER THROUGH CORRECT ANSWER 

      this.setState({
        questions: clonedArayOne
      })
      
      
      // // FILTERIGN RIGHT ANSWER
      // const clonedForRightAnswer = Array.from(this.state.questions);      
      // const eachCorrectAnswer = clonedForRightAnswer.map(answer => answer.correct_answer);
    
      
      // let filtereCorrectAnswer = [];
      // let filteredCorrectOne; 
      // eachCorrectAnswer.forEach((item) => {
      //   filteredCorrectOne = item.replace(doubleQuoteRegex, '"');
      //   filtereCorrectAnswer.push(filteredCorrectOne)
      // })

      // let filteredCorrectSingle =[];
      // let filteredCorrectTwo;
      // filtereCorrectAnswer.forEach((item) => {
      //   filteredCorrectTwo = item.replace(singleQuoteRegex, "'");
      //   filteredCorrectSingle.push(filteredCorrectTwo)
      // })

      // // filtering through for &ampersands&
      // let filteredCorrectAnd = [];
      // let filtredCorrectThree;
      // filteredCorrectSingle.forEach((item) => {
      //   filtredCorrectThree = item.replace(ampersandRegex, "&")
      //   filteredCorrectAnd.push(filtredCorrectThree)
      // })

      // // // replace the correct answer in the questions object
      // let clonedRightAnswer = Array.from(this.state.questions)
      // for (let i = 0; i <= (clonedRightAnswer.length - 1); i++){
      //   clonedRightAnswer[i].correct_answer = filteredCorrectAnd[i]
      // }

      this.setState({
        // questions: clonedRightAnswer
      })

    })
  }

  filtering = () => {

  }

  nextQuestion = () => {
    const arrayClone = Array.from(this.state.playerArray);
    arrayClone.forEach((player) => {
      player.correct = false
    })
    this.setState({
      questionProgress: this.state.questionProgress + 1,
      playerArray: arrayClone

    })
  }
  
// FILTER THROUGH COMBINED CHOICES
  combineChoices = (questions) => {

    // big loop, looping through questions
      const newQuestions = questions.map((question) => {
      const allChoices = Array.from(question.incorrect_answers); 
      allChoices.push(question.correct_answer);
      allChoices.sort(() => .5 - Math.random());
      question.allChoices = allChoices;

      // ==============
      // REGEX FILTERING ANSWER
      // ==============

      // const doubleQuoteRegex = /(&quot;)+|(&ldquo)/g;
      const doubleQuoteRegex = /(&quot;)+|(&ldquo)+|(&rdquo;)/g;
      const singleQuoteRegex = /(&#039;)/g;
      const ampersandRegex = /(&amp;)/g;
      
      // filtering through double quotes
      let filteredAnswers = [];
      let filteredEachAnswer;
      allChoices.forEach((item) => {
        filteredEachAnswer = item.replace(doubleQuoteRegex, '"');
        filteredEachAnswer = filteredEachAnswer.replace(singleQuoteRegex, "'");
        filteredEachAnswer = filteredEachAnswer.replace(ampersandRegex, "&");
        filteredAnswers.push(filteredEachAnswer)
      })

      // console.log("filtered choices")
      // console.log(filteredAnswers);
      

      // filtering through single quotes 
      // let filteredAnswerSingle = [];
      // let filteredAnswerTwo;
      // filteredAnswerDouble.forEach((item) => {
      //   filteredAnswerTwo = item.replace(singleQuoteRegex, "'");
      //   filteredAnswerSingle.push(filteredAnswerTwo)
      // })

      // let filteredAnswerAnd = [];
      // let filteredAnswerThree;
      //   filteredAnswerSingle.forEach((item) => {
      //     filteredAnswerThree = item.replace(ampersandRegex, "&");
      //     filteredAnswerAnd.push(filteredAnswerThree)
      //   })

        // console.log("filteredAnswer")
        // console.log(filteredAnswerAnd);
        

      // replacing each question's allChoices with the filtered answers  
        question.allChoices = filteredAnswers

       
    
      return question;
    })

    console.log("give me an object")
    console.log(questions)

    this.setState({
      questions: questions
    })

    return newQuestions;
  }

  // info from the props from the StartingPage where users pick the number of players (1-4) that are gonna play
  submitPlayers = (numberOfPlayers) => {
    // console.log(numberOfPlayers)
    this.setState({
      numberOfPlayers
    })
  }
  
  // getting info from Players.js 
  // giving them the array for each player where they have properties of playerNumber and username
  // ???what is going on here with these brackets around playerName: where are you setting the state? Is that how you set the state inside of an object? 


  addPlayers = (playerArray) => {
    this.setState({
      playerArray
    })
  }


  // adding 1 to score if user gets a question right
  // cloning the array from above 
  // 
  scoreCount = (username, i) => {
    const arrayClone = Array.from(this.state.playerArray);
    arrayClone[i].correct = true;
    arrayClone[i].score++;
    this.setState({
      playerArray: arrayClone
    })
  }

  resetQuestions = () => {
    this.setState({
      questionProgress: 0
    })
  }

  // Routes to all the pages Components are linked to
  render() {
    return (
      <BrowserRouter>
        <Route
          render={({location}) => (
            <div className="App">

              <PoseGroup>
                <RouteContainer key={location.key}>
                  <Switch location={location}>

                    <Route exact path="/" component={LandingPage} />

                    <Route exact path="/start" render={(props) => <StartingPage {...props}
                      submitPlayers={this.submitPlayers} />} />

                    <Route exact path="/players" render={(props) => <Players {...props}
                      numberOfPlayers={this.state.numberOfPlayers}
                      addPlayers={this.addPlayers} />} />

                    <Route exact path="/choice" render={(props) =>
                      <Choice {...props} getQuestions={this.getQuestions} />
                    } />

                    <Route
                      exact path="/questions"
                      render={(props) =>
                        <Questions {...props}
                          questions={this.state.questions}
                          questionProgress={this.state.questionProgress}
                          players={this.state.playerArray}
                          scoreCount={this.scoreCount} />
                      } />

                    <Route exact path="/results"
                      render={(props) =>
                        <Results {...props}
                          questions={this.state.questions}
                          questionProgress={this.state.questionProgress}
                          players={this.state.playerArray}
                          scoreCount={this.scoreCount}
                          nextQuestion={this.nextQuestion}
                          resetQuestions={this.resetQuestions}
                          difficulty={this.state.difficulty}
                          category={this.state.category}
                        />
                      } />

                    <Route exact path="/leaderboard" component={LeaderBoard} />

                  </Switch>
                </RouteContainer>
              </PoseGroup>
              
            </div>
          )}
          
        />    
      </BrowserRouter>
    );
  }
}

export default App;

import { useState, useEffect } from "react";
import './CustomerQuestion.css'
const CustomerSurvey = () => {
  const questions = [
    { id: 1, que: "How satisfied are you with our products?", type: "rating", scale: 5 },
    { id: 2, que: "How fair are the prices compared to similar retailers?", type: "rating", scale: 5 },
    { id: 3, que: "How satisfied are you with the value for money of your purchase?", type: "rating", scale: 5 },
    { id: 4, que: "On a scale of 1-10 how would you recommend us to your friends and family?", type: "rating", scale: 10 },
    { id: 5, que: "What could we do to improve our service?", type: "text" }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState({}); // Holds answers for localStorage only
  const [currentAnswers, setCurrentAnswers] = useState({}); // Holds UI answers
  const [completed, setCompleted] = useState(false);
  const [surveyStatus, setSurveyStatus] = useState("INCOMPLETE");

  // Load existing answers and survey status from localStorage on initial load
  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem("customerSurveyAnswers")) || {};
    const storedStatus = localStorage.getItem("surveyStatus") || "INCOMPLETE";
    setAnswers(storedAnswers);
    setSurveyStatus(storedStatus);

    // Populate UI with stored answers if any
    setCurrentAnswers(storedAnswers);
  }, []);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customerSurveyAnswers", JSON.stringify(answers));
  }, [answers]);

  // Save survey status to localStorage
  useEffect(() => {
    localStorage.setItem("surveyStatus", surveyStatus);
  }, [surveyStatus]);

  const handleAnswerChange = (id, value) => {
    setCurrentAnswers({ ...currentAnswers, [id]: value });
  };

  const saveAnswer = (id) => {
    setAnswers({ ...answers, [id]: currentAnswers[id] });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      saveAnswer(questions[currentQuestion].id); // Save current answer to answers
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your answers?")) {
      saveAnswer(questions[currentQuestion].id);
      setSurveyStatus("COMPLETED");
      localStorage.setItem("surveyStatus", "COMPLETED");
      setCompleted(true);
      setTimeout(() => {
        setCurrentQuestion(-1); // Reset to welcome screen
        setCompleted(false);
        setCurrentAnswers({}); // Clear current UI answers
      }, 5000);
    }
  };

  if (currentQuestion === -1) {
    return (
      <div className="welcome">
        <h1>Welcome to Our Survey!</h1>
        <button onClick={() => setCurrentQuestion(0)}>Start Survey</button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="response">
        <h1>Thank you for your time!</h1>
        <p>Your responses have been recorded.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="main-container">
      <h1>Question {currentQuestion + 1} / {questions.length}</h1>
      <h2>{question.que}</h2>

      {question.type === "rating" && (
        <select
          value={currentAnswers[question.id] || ""}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
        >
          <option value="">Select a rating</option>
          {[...Array(question.scale)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      )}
      {question.type === "text" && (
        <textarea
          value={currentAnswers[question.id] || ""}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
        />
      )}

      <div className="buttons">
        <button onClick={handlePrevious} disabled={currentQuestion === 0} className="previous">Previous</button>
        <button onClick={handleSkip} className="skip">Skip</button>
        {currentQuestion < questions.length - 1 ? (
          <button onClick={handleNext} className="next">Next</button>
        ) : (
          <button onClick={handleSubmit} className="submit">Submit</button>
        )}
      </div>
    </div>
  );
};

export default CustomerSurvey;

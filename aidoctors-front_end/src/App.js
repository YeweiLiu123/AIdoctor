import React, { useState } from 'react';
import './App.css';
import doctorImage from './pictures/doctor.jpg'; 

function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    concern: '',
    medicalHistory: ''
  });
  const [advice, setAdvice] = useState('');

  const questions = [
    { label: 'Hi, we will ask you a few questions to identify your symptoms and better assist your situation. You can skip any question if you prefer not to share that information.', type: 'text', name: 'welcome_message' },
    { label: 'What is your age? (Skip if you prefer not to share)', type: 'number', name: 'age' },
    { label: 'What is your gender? (Skip if you prefer not to share)', type: 'select', name: 'gender', options: ['Female', 'Male'] },
    { label: 'What is your height? (in cm) (Skip if you prefer not to share)', type: 'number', name: 'height' },
    { label: 'What is your weight? (in kg) (Skip if you prefer not to share)', type: 'number', name: 'weight' },
    { label: 'What is your primary concern?', type: 'text', name: 'concern' },
    { label: 'Please provide any relevant medical history (Skip if you prefer not to share)', type: 'text', name: 'medicalHistory' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setAdvice(result.advice);
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  const renderQuestion = () => {
    const question = questions[step];
    if (step === 0) {
      return (
        <div>
          <p>{question.label}</p>
          <button onClick={handleNext}>Start</button>
        </div>
      );
    }
    switch (question.type) {
      case 'number':
        return (
          <label>
            {question.label}:
            <input type="number" name={question.name} value={formData[question.name]} onChange={handleInputChange} />
          </label>
        );
      case 'select':
        return (
          <label>
            {question.label}:
            <select name={question.name} value={formData[question.name]} onChange={handleInputChange}>
              {question.options.map(option => (
                <option key={option} value={option.toLowerCase()}>{option}</option>
              ))}
            </select>
          </label>
        );
      case 'text':
        return (
          <label>
            {question.label}:
            <input type="text" name={question.name} value={formData[question.name]} onChange={handleInputChange} />
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="chat-bubble">
          <p><strong>Hi, this is AI Doctor, a completely free and private online service that can assist you with your health concerns. Based on your body conditions, we provide the best possible advice for your specific health issues.</strong></p>
        </div>
        <div className="question-container">
          <div className="chat-bubble user">
            {renderQuestion()}
            <br />
            {step > 0 && <button onClick={handleNext}>Next</button>}
            {step > 0 && <button onClick={handleSkip}>Skip</button>}
          </div>
        </div>
        {advice && (
          <div className="chat-bubble">
            <p><strong>Advice:</strong> {advice}</p>
          </div>
        )}
        <p className="hipaa">🔒 HIPAA compliant and anonymous</p>
        <img src={doctorImage} className="Doctor-image" alt="Doctor" />
      </header>
    </div>
  );
}

export default App;

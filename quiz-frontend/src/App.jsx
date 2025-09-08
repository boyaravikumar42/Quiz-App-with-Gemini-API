import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Route,Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import NavBar from './components/NavBar'
import NotFound from './components/NotFound'
import Home from './components/Home'
import Profile from './components/Profile'
import GenerateQuizForm from './components/QuizGeneratorForm'
import QuizList from './components/QuizList'
import ResetPassword from './components/ResetPassword'
import ConductQuiz from './components/ConductQuiz'
import Leaderboard from './components/Leaderboard'


function App() {
  

  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-quiz" element={<GenerateQuizForm />} />
  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quiz-generator" element={<GenerateQuizForm />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path='*' element={<NotFound/>}/>
        <Route path="/about" element={<Home />} />
        <Route path ="/password-reset" element={<ResetPassword/>}></Route>
        <Route path="/conduct-quiz/:quizId" element={<ConductQuiz />} />
        <Route path="/leaderboard/:quizId" element={<Leaderboard />} />
      </Routes>
       <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    
 
    </div>
  )
}

export default App

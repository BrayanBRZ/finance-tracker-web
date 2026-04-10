import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Form from './pages/Form/Form';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() { 

  return (
    <div>
      <Header title="ToDoList"/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/form" element={<Form/>}/>
          <Route path="/form/:id" element={<Form/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

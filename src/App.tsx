import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import Login from "./features/login";
import {AuthUtil} from "./util/AuthUtil";
import {Home} from "./features/home";
import {ViewBook} from "./features/viewbook";

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Home/>} />
          <Route path="/books/:bookId" element={<ViewBook/>} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { StrictMode } from 'react';

// Remove StrictMode for react-beautiful-dnd compatibility
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
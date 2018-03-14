import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Arty from './arty'
import { Provider } from 'react-redux'
import store from './store'

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
// registerServiceWorker();

Arty()
console.log('hi')

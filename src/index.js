import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/game.css'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Board />, document.getElementById('root'));
registerServiceWorker();

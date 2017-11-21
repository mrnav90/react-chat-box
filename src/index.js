import React from 'react';
import ReactDOM from 'react-dom';
import {AppRoot, routes} from 'routes';
import {store} from 'reducers';
import 'styles/main.scss';

ReactDOM.render((
  <AppRoot store={store} routes={routes}/>
), document.getElementById('app'));

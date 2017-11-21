import {createStore, combineReducers, applyMiddleware} from 'redux';
import {routerReducer} from 'react-router-redux';
import reduxThunk from 'redux-thunk';

const rootReducer = combineReducers({
  routing: routerReducer
});

const store = createStore(rootReducer, applyMiddleware(reduxThunk));

export {store, rootReducer};

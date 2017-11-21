import reduxAPI from 'redux-api';
import axiosRequest from './axios';

export default reduxAPI({
  connectChatBot: {
    url: 'bots/webwidget/:apiKey/connect',
    options: {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  },
  verifyAPIKey: {
    url: 'bots/webwidget/:apiKey/verify',
    options: {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  },
  historyMessages: {
    url: 'bots/webwidget/history',
    options: (url, params) => {
      return {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${params.access_token}`
        }
      };
    }
  }
}).use('fetch', axiosRequest).use('rootUrl', API_URL);

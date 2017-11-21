import {
  Application,
  ChatBoxForm
} from 'components';

const routes = [
  {
    component: Application,
    routes: [
      {path: '/:apiKey/:uuid', exact: true, component: ChatBoxForm}
    ]
  }
];

export default routes;

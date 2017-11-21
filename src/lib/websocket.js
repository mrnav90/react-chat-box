import WebsocketClient from 'adonis-websocket-client';

export default class WebsocketConnect {
  constructor() {
    this.websocket = new WebsocketClient(SOCKET_URL, {transports: ['websocket', 'polling', 'flashsocket']});
  }

  init(token) {
    if (this._chatChannel) {
      return this._chatChannel;
    }
    this._chatChannel = this.websocket.channel('guest').withJwt(token);
    return this._chatChannel;
  }

  close() {
    if (this._chatChannel) {
      return true;
    }
    return this.websocket.close();
  }

  get chatChannel() {
    return this._chatChannel;
  }

  set chatChannel(channel) {
    this._chatChannel = channel;
  }
}

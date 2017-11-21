import React from 'react';
import classNames from 'classnames';
import {Loader, ShowIf} from 'components';
import TimeAgo from 'react-timeago';
import {ChatBox} from 'api';
import WebsocketConnect from 'lib/websocket';
import momentTimzone from 'moment-timezone';
import {parse} from 'qs';

class ChatBoxForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      messages: [],
      isShowChatBox: false,
      isLoading: false,
      chatMessage: '',
      accessToken: null,
      messageError: null,
      isWSConnected: false,
      isValidAPIKey: false,
      reloadMessageHistory: false
    };
    this.WebsocketConnect = new WebsocketConnect();
    this.toggleChatBox = this.toggleChatBox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getHistoryMessages = this.getHistoryMessages.bind(this);
    this.connectChatBot = this.connectChatBot.bind(this);
    this.connectWebSocket = this.connectWebSocket.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  toggleChatBox() {
    this.setState({isShowChatBox: !this.state.isShowChatBox}, () => {
      const {isShowChatBox, isValidAPIKey} = this.state;
      const apiKey = this.props.match.params.apiKey;
      if (isShowChatBox) {
        if (!isValidAPIKey) {
          if (apiKey) {
            this.setState({isLoading: true});
            ChatBox.actions.verifyAPIKey.request({apiKey}).then(response => {
              this.setState({isLoading: false, isValidAPIKey: response.success});
              this.connectChatBot();
            }).catch((error) => {
              this.setState({isLoading: false, messageError: error.message});
            });
          } else {
            this.setState({messageError: 'APIキーもしくはUUIDが見つかりませんでした'});
          }
        } else {
          this.connectChatBot();
        }
      }
    });
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  getHistoryMessages() {
    this.setState({isLoading: true});
    ChatBox.actions.historyMessages.request({}, {access_token: this.state.accessToken}).then(response => {
      this.setState({isLoading: false, reloadMessageHistory: false, messages: response.data});
    }).catch((error) => {
      this.setState({isLoading: false, reloadMessageHistory: true, messageError: error.message});
    });
  }

  connectChatBot() {
    const query = parse(this.props.location.search.substr(1));
    const {apiKey, uuid} = this.props.match.params;
    if (this.state.accessToken && uuid) {
      this.connectWebSocket();
    } else {
      this.setState({isLoading: true});
      const data = {
        uid: uuid,
        dm: query.from
      };
      ChatBox.actions.connectChatBot.request({apiKey}, {data}).then(response => {
        this.setState({isLoading: false, accessToken: response.access_token});
        this.connectWebSocket();
      }).catch((error) => {
        this.setState({isLoading: false, messageError: error.message});
      });
    }
  }

  connectWebSocket() {
    if (!this.WebsocketConnect.chatChannel) {
      this.setState({isLoading: true}, () => {
        this.WebsocketConnect.init(this.state.accessToken).connect(() => {
          this.setState({isWSConnected: true, isLoading: false, messageError: null}, () => {
            this.getHistoryMessages();
            this.WebsocketConnect.chatChannel.on('message', (message) => {
              const messages = this.state.messages;
              messages.push(JSON.parse(message));
              this.setState({messages});
            });
          });
        });
        this.WebsocketConnect.chatChannel.on('disconnect', () => {
          this.setState({isWSConnected: false, messageError: 'Websocketは切断されました。'});
        });
        this.WebsocketConnect.chatChannel.on('reconnect', () => {
          this.setState({isWSConnected: true});
        });
        this.WebsocketConnect.chatChannel.on('error', () => {
          this.setState({isWSConnected: false, isLoading: false, messageError: 'Socketサーバーへ接続できません。'});
        });
      });
    } else {
      if (this.WebsocketConnect.chatChannel._io.disconnected) {
        this.setState({isLoading: true});
        this.WebsocketConnect.chatChannel._io.connect();
      }
      if (this.state.reloadMessageHistory && this.state.messages.length === 0) {
        this.setState({isLoading: true});
        this.getHistoryMessages();
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.WebsocketConnect.chatChannel && this.state.chatMessage !== '') {
      const data = {
        content: this.state.chatMessage,
        type: 'text',
        created_at: momentTimzone().tz(momentTimzone.tz.guess()).format(),
        owner: true
      };
      const messages = this.state.messages;
      messages.push(data);
      this.setState({messages: messages, chatMessage: ''});
      this.WebsocketConnect.chatChannel.emit('message', data);
    }
  }

  render() {
    const {
      messages,
      isShowChatBox,
      chatMessage,
      isLoading,
      messageError,
      isWSConnected,
      isValidAPIKey,
      reloadMessageHistory
    } = this.state;
    return (
      <div className="wrapper">
        <a className={classNames('toggle-chatbox', {'open-chatbox': isShowChatBox})} onClick={this.toggleChatBox}></a>
        <div className={classNames('chatbox', {'hide-chatbox': !isShowChatBox})}>
          <form name="ChatBoxForm" onSubmit={this.onSubmit} method="POST" noValidate>
            <Loader isShow={isLoading} />
            <div className="chatbox-header"></div>
            <ShowIf condition={messageError && !isLoading}>
              <div className="chatbox-alert">
                <p>{messageError}</p>
                {reloadMessageHistory && isWSConnected && isValidAPIKey && <button type="button" onClick={this.getHistoryMessages} className="btn-reload-message" name="reload-message">メッセージ履歴をリロード</button>}
                {!isWSConnected && isValidAPIKey && <button type="button" onClick={this.connectChatBot} className="btn-reconnect-chatbot" name="reconnect">Chatbotへ再接続</button>}
              </div>
            </ShowIf>
            <ShowIf condition={!messageError && !isLoading && isWSConnected && isValidAPIKey}>
              <div className="chatbox-content" id="chatbox-container">
                {
                  messages.map((message, idx) => {
                    return (
                      <div key={idx} className={classNames('message-item', {'left': !message.owner, 'right': message.owner})}>
                        <div className="item-avatar"></div>
                        <div className="item-content">{message.content}</div>
                        <TimeAgo className="time-post" date={message.created_at} />
                      </div>
                    );
                  })
                }
              </div>
            </ShowIf>
            <ShowIf condition={!messageError && !isLoading && isWSConnected && isValidAPIKey}>
              <div className="chatbox-footer">
                <input type="text" className="chatbox-message" onChange={this.onChange} value={chatMessage} name="chatMessage" maxLength="2000" placeholder="メッセージを入力してください" autoComplete="off" />
                <button type="submit"></button>
              </div>
            </ShowIf>
          </form>
        </div>
      </div>
    );
  }
}

export default ChatBoxForm;

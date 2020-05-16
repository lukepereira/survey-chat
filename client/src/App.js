import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";
import Modal from "react-bootstrap/lib/Modal";
import UserList from "./components/UserList";
import SurveyForm from "./components/SurveyForm";
import SurveyList from "./components/SurveyList";
import ChatBox from "./components/ChatBox";
import ErrorModal from "./components/ErrorModal";
import LoadingModal from "./components/LoadingModal";
import "react-chat-elements/dist/main.css";
import "./index.css";
import io from "socket.io-client";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";
import hash from "object-hash";

const SOCKET_URI = "http://localhost:8080";

class App extends Component {
  socket = null;

  state = {
    signInModalShow: false,
    users: [],
    userChatData: {},
    user: null,
    showChatBox: false,
    showChatList: true,
    selectedRoom: null,
    showSurveyList: true,
    showSurveyForm: false,
    surveyState: {},
    error: false,
    errorMessage: "",
  };

  componentDidMount() {
    this.initAxios();
    this.initSocketConnection();
    this.setupSocketListeners();
  }

  initSocketConnection() {
    this.socket = io.connect(SOCKET_URI);
  }

  initAxios() {
    axios.interceptors.request.use(
      (config) => {
        this.setState({ loading: true });
        return config;
      },
      (error) => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Couldn't connect to server. try refreshing the page.`,
          error: true,
        });
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        this.setState({ loading: false });
        return response;
      },
      (error) => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Some error occured. try after sometime`,
          error: true,
        });
        return Promise.reject(error);
      }
    );
  }

  onClientDisconnected() {
    NotificationManager.error(
      "Connection Lost from server please check your connection.",
      "Error!"
    );
  }

  onReconnection() {
    if (this.state.user) {
      this.socket.emit("sign-in", this.state.user);
      NotificationManager.success("Connection Established.", "Reconnected!");
    }
  }
  onReceiveUID = (uid) => {
    this.setState({ user: { id: uid, name: uid.substring(0, 8) } });
  };

  setupSocketListeners() {
    this.socket.on("message", this.onMessageRecieved.bind(this));
    this.socket.on("reconnect", this.onReconnection.bind(this));
    this.socket.on("disconnect", this.onClientDisconnected.bind(this));
    this.socket.on("receive-uid", this.onReceiveUID);
  }

  onMessageRecieved(message) {
    let userChatData = this.state.userChatData;
    let messageData = message.message;
    if (message.from === this.state.user.id) {
      messageData.position = "right";
    } else {
      messageData.position = "left";
    }
    if (!userChatData[this.state.selectedRoom]) {
      userChatData[this.state.selectedRoom] = { messages: [] };
    }
    userChatData[this.state.selectedRoom].messages.push(messageData);
    this.setState({ userChatData });
  }

  onSurveyClicked = (selectedRoom) => {
    const userChatData = {
      [selectedRoom]: { messages: [] },
    };
    this.setState(
      {
        selectedRoom,
        userChatData,
        showChatBox: true,
        showSurveyForm: true,
        showSurveyList: false,
      },
      () => this.socket.emit("join-room", { room: this.getRoomName() })
    );
  };

  createMessage(text) {
    let message = {
      to: this.getRoomName(),
      message: {
        type: "text",
        text: text,
        date: +new Date(),
        className: "message",
        title: this.state.user.name,
      },
      from: this.state.user.id,
    };
    this.socket.emit("message", message);
  }

  toggleViews() {
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList,
    });
  }

  getRoomName = () => {
    return `${this.state.selectedRoom}-${hash(this.state.surveyState, {
      unorderedArrays: true,
      unorderedSets: true,
    })}`;
  };

  updateSurveyState = (surveyState) => {
    const userChatData = {
      [this.state.selectedRoom]: { messages: [] },
    };
    this.setState({ surveyState, userChatData }, () =>
      this.socket.emit("join-room", { room: this.getRoomName() })
    );
  };

  render() {
    let chatBoxProps = this.state.showChatBox
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xsHidden: true,
          smHidden: true,
        };

    let chatListProps = this.state.showChatList
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xsHidden: true,
          smHidden: true,
        };

    return (
      <div>
        <NavBar signedInUser={this.state.user} />
        <Grid>
          <Row className="show-grid">
            <Col {...chatListProps} md={4}>
              <SurveyList
                onSurveyClicked={this.onSurveyClicked}
                activeRoom={this.state.selectedRoom}
              />
              {this.state.selectedRoom && (
                <SurveyForm
                  surveyName={this.state.selectedRoom}
                  updateSurveyState={this.updateSurveyState}
                />
              )}
            </Col>
            <Col {...chatBoxProps} md={8}>
              <ChatBox
                roomName={this.state.selectedRoom}
                signedInUser={this.state.user}
                onSendClicked={this.createMessage.bind(this)}
                onBackPressed={this.toggleViews.bind(this)}
                chatData={this.state.userChatData[this.state.selectedRoom]}
              />
            </Col>
          </Row>
        </Grid>
        <Modal show={this.state.signInModalShow}>
          <Modal.Header>
            <Modal.Title>Sign In as:</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <UserList userData={this.state.users} showSignInList />
          </Modal.Body>
        </Modal>
        <ErrorModal
          show={this.state.error}
          errorMessage={this.state.errorMessage}
        />
        <LoadingModal show={this.state.loading} />
        <NotificationContainer />
      </div>
    );
  }
}

export default App;

import React, { useState, useEffect, useRef } from "react";
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
import { fetchUsers } from "./requests";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";

const SOCKET_URI = process.env.REACT_APP_SERVER_URI || "http://localhost:8002";

const socket = io.connect(SOCKET_URI);

const App = () => {
  const [state, setState] = useState({
    loading: false,
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
    socket: null,
    lastMessage: null,
  });
  const stateRef = useRef(state);

  useEffect(() => {
    initAxios();
    // fetchUsers().then((users) => setState({ ...state, users }));
  }, []);

  useEffect(() => {
    socket.on("reconnect", onReconnection);
    socket.on("disconnect", onClientDisconnected);
    socket.on("receive-uid", onReceiveUID);
    socket.on("message", onMessageRecieved);
  }, []);

  useEffect(() => {
    if (state.selectedRoom) {
      socket.emit("join-room", {
        room: getRoomName(state.selectedRoom, state.surveyState),
      });
    }
  }, [state.surveyState, state.selectedRoom]);

  useEffect(() => {
    updateChat();
  }, [state.lastMessage]);

  const initAxios = () => {
    axios.interceptors.request.use(
      (config) => {
        setState({ ...state, loading: true });
        return config;
      },
      (error) => {
        setState({
          ...state,
          loading: false,
          errorMessage: `Couldn't connect to server. try refreshing the page.`,
          error: true,
        });
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        setState({
          ...state,
          loading: false,
        });
        return response;
      },
      (error) => {
        setState({
          ...state,
          loading: false,
          errorMessage: `Some error occured. try after sometime`,
          error: true,
        });
        return Promise.reject(error);
      }
    );
  };

  const onClientDisconnected = () => {
    NotificationManager.error(
      "Connection Lost from server please check your connection.",
      "Error!"
    );
  };

  const onReconnection = () => {
    if (state.user) {
      socket.emit("sign-in", state.user);
      NotificationManager.success("Connection Established.", "Reconnected!");
    }
  };

  const onReceiveUID = (uid) => {
    setState({ ...state, user: { id: uid, name: uid.substring(0, 8) } });
  };

  const updateChat = () => {
    console.log("^^^^", state);
    if (!state.lastMessage || !state.user) {
      return;
    }
    let userChatData = state.userChatData;
    let messageData = state.lastMessage;
    if (state.lastMessage.from === state.user.id) {
      messageData.position = "right";
    } else {
      messageData.position = "left";
    }
    if (!userChatData[state.selectedRoom]) {
      userChatData[state.selectedRoom] = { messages: [] };
    }
    userChatData[state.selectedRoom].messages.push(messageData);
    setState({ ...state, userChatData });
  };

  const onMessageRecieved = (message) => {
    setState({ lastMessage: message.message });
  };

  const onSurveyClicked = (selectedRoom) => {
    const userChatData = {
      [selectedRoom]: { messages: [] },
    };
    setState({
      ...state,
      selectedRoom,
      userChatData,
      showChatBox: true,
      showSurveyForm: true,
      showSurveyList: false,
    });
  };

  const createMessage = (text) => {
    let message = {
      to: getRoomName(state.surveyName, state.surveyState),
      message: {
        type: "text",
        text: text,
        date: +new Date(),
        className: "message",
        title: state.user.name,
      },
      from: state.user.id,
    };
    socket.emit("message", message);
  };

  const toggleViews = () => {
    setState({
      ...state,
      showChatBox: !state.showChatBox,
      showChatList: !state.showChatList,
    });
  };

  const getRoomName = (selectedRoom, surveyState) => {
    console.log("^^^^getRoomName", selectedRoom, surveyState);
    return `${selectedRoom}-${btoa(JSON.stringify(surveyState))}`;
  };

  const updateSurveyState = (surveyState) => {
    const userChatData = {
      [state.selectedRoom]: { messages: [] },
    };
    setState({ ...state, surveyState, userChatData });
  };

  const chatBoxProps = state.showChatBox
    ? {
        xs: 12,
        sm: 12,
      }
    : {
        xsHidden: true,
        smHidden: true,
      };

  const chatListProps = state.showChatList
    ? {
        xs: 12,
        sm: 12,
      }
    : {
        xsHidden: true,
        smHidden: true,
      };

  console.log("^^^^state update", state);

  return (
    <div>
      <NavBar signedInUser={state.user} />
      <Grid>
        <Row className="show-grid">
          <Col {...chatListProps} md={4}>
            <SurveyList
              onSurveyClicked={onSurveyClicked}
              activeRoom={state.selectedRoom}
            />
            {state.selectedRoom && (
              <SurveyForm
                surveyName={state.selectedRoom}
                updateSurveyState={updateSurveyState}
              />
            )}
          </Col>
          <Col {...chatBoxProps} md={8}>
            <ChatBox
              roomName={state.selectedRoom}
              signedInUser={state.user}
              onSendClicked={createMessage}
              onBackPressed={toggleViews}
              chatData={null} //state.userChatData[state.selectedRoom]}
            />
          </Col>
        </Row>
      </Grid>
      <Modal show={state.signInModalShow}>
        <Modal.Header>
          <Modal.Title>Sign In as:</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <UserList userData={state.users} showSignInList />
        </Modal.Body>
      </Modal>
      <ErrorModal show={state.error} errorMessage={state.errorMessage} />
      <LoadingModal show={state.loading} />
      <NotificationContainer />
    </div>
  );
};

export default App;

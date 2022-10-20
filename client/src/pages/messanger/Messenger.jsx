import "./messenger.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import Topbar from "./../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/messege/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const Messenger = () => {
  const { user } = useContext(AuthContext);
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const newMessage = useRef("");
  const scrollRef = useRef();
  useEffect(() => {
    setSocket(io("ws://localhost:8900"));
  });
  useEffect(() => {
    axios
      .get(`conversation/${user?._id}`)
      .then((res) => {
        setConversation(res?.data);
      })
      .catch((err) => console.log(err));
  }, [user._id]);
  useEffect(() => {
    const getMessages = async () => {
      axios
        .get(`message/${currentChat?._id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.log(err));
    };
    getMessages();
  }, [currentChat]);
  const handleSendMessage = () => {
    const message = {
      conversationId: currentChat,
      sender: user._id,
      text: newMessage.current.value,
    };
    axios
      .post("message", message)
      .then((res) => {
        setMessages([...messages, res.data]);
        newMessage.current.value = "";
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversation.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop" key={currentChat._id}>
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="Write something..."
                    className="chatMessageInput"
                    ref={newMessage}
                  ></textarea>
                  <button
                    className="chatSubmitButton"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;

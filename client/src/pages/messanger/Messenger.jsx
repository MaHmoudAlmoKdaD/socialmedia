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
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const newMessage = useRef("");
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.include(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    const message = {
      conversationId: currentChat,
      sender: user._id,
      text: newMessage.current.value,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    const info = {
      senderId: user._id,
      receiverId: receiverId,
      text: newMessage,
    };
    socket.current.emit("sendMessage", info);
    axios
      .post("message", message)
      .then((res) => {
        setMessages([...messages, res.data]);
        newMessage.current.value = "";
      })
      .catch((err) => console.log(err));
  };

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
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m._id}>
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



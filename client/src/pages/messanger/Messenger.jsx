import "./messenger.css";
import React, { useContext, useEffect, useState } from "react";
import Topbar from "./../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/messege/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";

const Messenger = () => {
  const { user } = useContext(AuthContext);
  const [conversation, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios
      .get(`conversation/${user?._id}`)
      .then((res) => {
        setConversation(res?.data);
      })
      .catch((err) => console.log(err));
  }, [user._id]);
  useEffect(() => {
    const getMessages = async() => {
      axios
        .get(`messages/${currentChat?._id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.log(err));
    };
    getMessages();
  }, [currentChat]);

  return (
    <>
      {console.log("messages",messages)}
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {conversation.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation key={c._id} conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop" key={currentChat._id}>
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  <Message />
                  <Message own={true} />
                  rgb(108, 102, 102) <Message />
                  <Message own={true} />
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="Write something..."
                    className="chatMessageInput"
                  ></textarea>
                  <button className="chatSubmitButton">Send</button>
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

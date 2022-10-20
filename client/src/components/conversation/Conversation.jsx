import { useEffect, useState } from "react";
import "./conversation.css";
import axios from "axios";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    const friendId = conversation.members.find((memberId) => {
      return memberId !== currentUser._id;
    });
    const getUsers = async () => {
      axios
        .get(`/users?userId=${friendId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUsers();
  }, [conversation, currentUser]);

  return (
    <div className="conversation" key={1+conversation._id}>
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? PF + user.profilePicture
            : PF + "/person/noAvatar.png"
        }
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
};

export default Conversation;

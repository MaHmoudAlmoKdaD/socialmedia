import "./message.css";

const Message = ({ own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src="data:image/jpeg;base64,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"
          alt=""
          className="messageImg"
        />
        <p className="messageText">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellat
          vitae ducimus incidunt quibusdam ex asperiores illum accusantium,
          debitis, deleniti alias ipsum? Natus consectetur, ipsa amet
          reprehenderit magnam tempora harum quasi.
        </p>
      </div>
      <div className="messageBottom">1 hour ago</div>
    </div>
  );
};

export default Message;
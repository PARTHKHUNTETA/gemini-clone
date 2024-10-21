import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./Sidebar.css";
import { Context } from "../../context/Context";
const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const { prevPrompts, setRecentPrompt, onSent, setShowResult,setLoading} =
    useContext(Context);

  function handleNewChatClick() {
    setLoading(false)
    setShowResult(false);
  }
  async function handleRecentClick(prompt) {
    setRecentPrompt(prompt);
    await onSent(prompt);
  }
  return (
    <div className="sidebar">
      <div className="top">
        <img
          className="menu"
          src={assets.menu_icon}
          alt="menu icon"
          onClick={() => setExtended((prev) => !prev)}
        />
        <div className="new-chat" onClick={handleNewChatClick}>
          <img
            className="new-chat-icon"
            src={assets.plus_icon}
            alt="new chat"
          />
          {extended && <p>New Chat</p>}
        </div>
        {extended && (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts &&
              prevPrompts.length > 0 &&
              prevPrompts.map((value, index) => (
                <div
                  className="recent-chats"
                  key={index}
                  onClick={() => handleRecentClick(value)}
                >
                  <img src={assets.message_icon} alt="Message icon" />
                  <p>
                    {value.length > 10 ? value.slice(0, 11) + "...." : value}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry ">
          <img src={assets.question_icon} alt="Question Icon" />
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="Question Icon" />

          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="Question Icon" />

          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

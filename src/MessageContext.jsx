import React, { createContext, useContext, useState } from "react";
import { message } from "antd";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messageContent, setMessageContent] = useState(null);

  const showMessage = (type, content, duration = 3) => {
    setMessageContent({ type, content, duration });
    message[type](content, duration);
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
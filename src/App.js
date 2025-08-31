import React from "react";
import Chatbot from "./Chatbot.jsx";

import "./App.css"; // Or your global CSS
import Landingpage from "./Landingpage.jsx";

function App() {
  const [showChatbot, setShowChatbot] = React.useState(false);
  return (
    <div className="App">
      {!showChatbot && <Landingpage  setShowChatbot={setShowChatbot}/> }  
      {showChatbot && <Chatbot setShowChatbot={setShowChatbot} />}

    </div>
  );
}

export default App;

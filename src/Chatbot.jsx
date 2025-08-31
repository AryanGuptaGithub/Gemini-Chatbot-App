import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

// Use this for the non-streaming API call
async function generateContent(prompt) {
  const metaPrompt = `
  You are a helpful AI tutor. 
  Always give detailed, beginner-friendly answers with examples.
  Format responses in Markdown with headings, bullet points, and code blocks.

  User question:
  ${prompt}
    `;

  const chatHistory = [{ role: "user", parts: [{ text: metaPrompt }] }];
  const payload = { contents: chatHistory };

  // The API key is now handled automatically by the Canvas environment.
  // The apiUrl must be constructed with a placeholder variable for the key.
  const apiKey = "AIzaSyBtz418w4hgfQNc8NvSDL3kj1rcZm6FS40";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    let response;
    let retries = 0;
    while (retries < 5) {
      try {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) break;
      } catch (e) {
        // Continue loop for retries
      }
      retries++;
      const delay = Math.pow(2, retries) * 100;
      await new Promise((res) => setTimeout(res, delay)); // Exponential backoff
    }

    if (!response || !response.ok) {
      throw new Error("API request failed after multiple retries.");
    }

    const result = await response.json();
    console.log("Gemini API raw response:", result);
    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from API.");
    }
  } catch (err) {
    console.error("Error generating content:", err);
    return "Oops! Something went wrong. Please try again.";
  }
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setLoading(true);

    const aiResponseText = await generateContent(input);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "assistant", content: aiResponseText },
    ]);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-inter pb-10 p-10 space-y-4 border ">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-md p-3 rounded-xl shadow-md ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none text-right"
                  : "bg-white text-gray-800 rounded-bl-none text-left"
              }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs sm:max-w-md p-3 rounded-xl shadow-md bg-white text-gray-500 rounded-bl-none animate-pulse">
              Typing...
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-4 flex items-center shadow-inner border-t border-gray-200">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Send a message..."
          rows="1"
          className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none overflow-hidden"
          style={{ maxHeight: "10rem" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="ml-2 p-3 bg-blue-500 text-white rounded-full shadow-lg transition-all duration-200 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transform rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

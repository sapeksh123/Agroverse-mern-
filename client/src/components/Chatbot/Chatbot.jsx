// // src/components/Chatbot.jsx
// import React, { useState } from 'react'
// import { IoSend } from 'react-icons/io5'
// import { GoogleGenerativeAI } from '@google/generative-ai'

// const Chatbot = () => {
//   const [message, setMessage] = useState("")
//   const [messages, setMessages] = useState([])
//   const [isResponseScreen, setIsResponseScreen] = useState(false)

//   const generateResponse = async (msg) => {
//     if (!msg) return

//     const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//     const result = await model.generateContent(msg)
//     const text = result.response.text()

//     setMessages([
//       ...messages,
//       { type: "user", text: msg },
//       { type: "bot", text: text }
//     ])
//     setIsResponseScreen(true)
//     setMessage("")
//   }

//   const handleSend = () => {
//     if (message.trim() === "") return alert("You must write something!")
//     generateResponse(message)
//   }

//   const newChat = () => {
//     setMessages([])
//     setIsResponseScreen(false)
//   }

//   return (
//     <div className="w-screen min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center">
//       <div className="w-full px-10 py-5 flex justify-between items-center border-b border-gray-700">
//         <h1 className="text-2xl font-bold">AssistMe</h1>
//         {isResponseScreen && (
//           <button onClick={newChat} className="bg-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-700 transition">
//             New Chat
//           </button>
//         )}
//       </div>

//       <div className="flex-1 w-full px-10 py-4 overflow-y-auto">
//         {messages.map((msg, index) => (
//           <div key={index} className={`my-3 ${msg.type === "user" ? "text-right" : "text-left"}`}>
//             <div className={`inline-block px-4 py-2 rounded-lg ${msg.type === "user" ? "bg-blue-600" : "bg-gray-700"}`}>
//               {msg.text}
//             </div>
//           </div>
//         ))}
//         {!isResponseScreen && (
//           <div className="text-center mt-20">
//             <p className="text-lg text-gray-400">Start chatting with AssistMe 🚀</p>
//           </div>
//         )}
//       </div>

//       <div className="w-full px-10 py-4 border-t border-gray-700">
//         <div className="flex items-center bg-[#181818] rounded-full px-4">
//           <input
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="flex-1 bg-transparent p-3 text-white outline-none"
//             placeholder="Write your message here..."
//           />
//           <button onClick={handleSend} className="text-green-500 text-2xl">
//             <IoSend />
//           </button>
//         </div>
//         <p className="text-center text-gray-500 text-xs mt-3">AssistMe uses Gemini AI by Google.</p>
//       </div>
//     </div>
//   )
// }

// export default Chatbot

// src/components/Chatbot.jsx
// import React, { useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const Chatbot = ({ theme }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const generateResponse = async (msg) => {
//     if (!msg.trim()) return;
//     setLoading(true);
//     setMessages([...messages, { type: "user", text: msg }]);
//     setMessage("");

//     try {
//       const result = await model.generateContent(msg);
//       const response = await result.response.text();
//       setMessages((prev) => [...prev, { type: "bot", text: response }]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [...prev, { type: "bot", text: "Error generating response." }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={`p-4 min-h-screen transition duration-500 ${theme === 'dark' ? 'bg-green-950 text-white' : 'bg-green-100 text-black'}`}>
//       <h1 className="text-3xl font-bold text-center mb-6">FarmBot AI 🌾</h1>
//       <div className="max-w-3xl mx-auto bg-white/10 rounded-lg p-4 space-y-4 shadow-lg">
//         <div className="space-y-3 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-green-400">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`p-3 rounded-xl w-fit ${
//                 msg.type === "user" ? "bg-green-700 text-white self-end ml-auto" : "bg-green-300 text-black"
//               }`}
//             >
//               {msg.text}
//             </div>
//           ))}
//           {loading && (
//             <div className="animate-pulse text-sm text-green-500">FarmBot is thinking...</div>
//           )}
//         </div>

//         <div className="flex gap-2 mt-4">
//           <input
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             type="text"
//             placeholder="Ask me about farming tips..."
//             className="flex-1 px-4 py-2 rounded-full border border-green-400 outline-none"
//             onKeyDown={(e) => e.key === "Enter" && generateResponse(message)}
//           />
//           <button
//             onClick={() => generateResponse(message)}
//             className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import TypingAnimation from "./TypingAnimation"; // Import the TypingAnimation component

const Chatbot = ({ theme }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generateResponse = async (msg) => {
    if (!msg.trim()) return;
    setLoading(true);
    setMessages([...messages, { type: "user", text: msg }]);
    setMessage("");

    try {
      const result = await model.generateContent(msg);
      const response = await result.response.text();
      setMessages((prev) => [...prev, { type: "bot", text: response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { type: "bot", text: "Error generating response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 min-h-screen transition duration-500 ${theme === 'dark' ? 'bg-green-950 text-white' : 'bg-green-100 text-black'}`}>
      <h1 className="text-3xl font-bold text-center mb-6">AgroBot AI 🌾</h1>
      <div className="max-w-3xl mx-auto bg-white/10 rounded-lg p-4 space-y-4 shadow-lg">
        <div className="space-y-3 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-green-400">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl w-fit ${
                msg.type === "user" ? "bg-green-700 text-white self-end ml-auto" : "bg-green-300 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <TypingAnimation /> // Show the typing animation when loading
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Ask me about farming tips..."
            className="flex-1 px-4 py-2 rounded-full border border-green-400 outline-none relative pl-2 typing-effect" // Add the typing-effect class here
            onKeyDown={(e) => e.key === "Enter" && generateResponse(message)}
          />
          <button
            onClick={() => generateResponse(message)}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

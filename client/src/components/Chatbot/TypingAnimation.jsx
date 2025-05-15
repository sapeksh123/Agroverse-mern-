import React from "react";
import "./TypingAnimation.css"; // Import CSS for the animation

const TypingAnimation = () => {
  return (
    <div className="typing-container flex items-center gap-2">
      <div className="dot dot1 w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce1"></div>
      <div className="dot dot2 w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce2"></div>
      <div className="dot dot3 w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce3"></div>
    </div>
  );
};

export default TypingAnimation;

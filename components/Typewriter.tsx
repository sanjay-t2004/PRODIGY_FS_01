"use client";

import React, { useState, useEffect, FC } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  styles?: string;
  delay?: number;
}

const Typewriter: FC<TypewriterProps> = ({
  text,
  speed = 100,
  styles = "",
  delay = 0,
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let intervalId: NodeJS.Timeout;

    const startTyping = () => {
      intervalId = setInterval(() => {
        if (index < text.length - 1) {
          setDisplayedText((prev) => prev + text[index]);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);
    };

    // Start typing after the specified delay
    const delayTimeout = setTimeout(startTyping, delay);

    return () => {
      clearInterval(intervalId);
      clearTimeout(delayTimeout);
    };
  }, [text, speed, delay]);

  return <p className={styles}>{displayedText}</p>;
};

export default Typewriter;

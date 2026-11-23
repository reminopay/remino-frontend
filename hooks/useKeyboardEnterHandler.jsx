"use client";
import { useEffect } from "react";

const useKeyboardEventHandler = (callback) => {
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        callback();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [callback]);
};

export default useKeyboardEventHandler;

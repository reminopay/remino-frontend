"use client";
import { useEffect, useRef } from "react";

const formatTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time - minutes * 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
};

const Countdown = ({ value, setValue }) => {
  const timerId = useRef();

  useEffect(() => {
    timerId.current = setInterval(() => {
      setValue((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId.current);
  }, [setValue]);

  useEffect(() => {
    if (value <= 0) {
      clearInterval(timerId.current);
    }
  }, [value]);
  return <span>{formatTime(value)} </span>;
};

export default Countdown;

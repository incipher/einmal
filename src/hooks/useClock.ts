import React, { useEffect } from 'react';

type Time = {
  hour: number;
  minute: number;
  second: number;
};

type Callback = (time: Time) => void;

const useClock = (callback: Callback) => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();

      callback({
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
};

export default useClock;

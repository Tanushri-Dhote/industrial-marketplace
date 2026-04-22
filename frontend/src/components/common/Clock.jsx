import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = minutes < 10 ? `0${minutes}` : minutes;
    const s = seconds < 10 ? `0${seconds}` : seconds;
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return {
      time: `${h}:${m}:${s} ${ampm}`,
      date: `${day}${month}${year}`
    };
  };

  const formatted = formatTime(time);

  return (
    <Text fontSize="12px" fontWeight="600" color="blue.600" fontFamily="monospace">
      <span style={{ fontSize: '18px' }}>{formatted.time.split(' ')[0]}</span>
      <span style={{ fontSize: '12px', marginLeft: '2px' }}>{formatted.time.split(' ')[1]}</span>
      <span style={{ marginLeft: '8px', color: 'gray.500', fontSize: '12px' }}>{formatted.date}</span>
    </Text>
  );
}

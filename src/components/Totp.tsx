import React, { useState, useEffect } from 'react';
import { Text, TextProps } from 'react-native';
import { totp } from '../crypto';

type Props = TextProps & {
  secret: string;
};

const Totp: React.FC<Props> = props => {
  const { secret, ...rest } = props;

  const [token, setToken] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setToken(totp(secret));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <Text {...rest}>{token || '000000'}</Text>;
};

export default Totp;

import React, { FC, useEffect, useState } from 'react';
import { Progress } from 'antd';
import moment from 'moment';

import { formatTimeHHMM, getTimeUntilNextRelease } from '../../../../helpers';

const HOUR_IN_S = 60 * 60;
const DAY_IN_S = 24 * HOUR_IN_S;
const MINUTE_IN_MS = 60 * 1000;

const Countdown: FC = () => {
  // init to days in seconds so we start from 0%
  const [time, setTime] = useState<number>(DAY_IN_S);

  useEffect(() => {
    setTime(getTimeUntilNextRelease());
    setInterval(() => {
      setTime(getTimeUntilNextRelease());
    }, MINUTE_IN_MS);
  }, []);

  return (
    <Progress
      size="small"
      percent={(DAY_IN_S - time) / DAY_IN_S * 100}
      status="active"
      format={() => formatTimeHHMM(time)}
      style={{ padding: '0 1em 0 0', maxWidth: '480px' }}
    />
  );
}


export { Countdown }
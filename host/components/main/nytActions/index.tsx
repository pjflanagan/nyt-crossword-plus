import React, { FC } from 'react';
import { Row, Button } from 'antd';
import { QuestionCircleOutlined, OrderedListOutlined } from '@ant-design/icons';

import { Countdown } from './countdown';

const NytActionsComponents: FC = () => {
  return (
    <>
      <h1>New York Times Crossword</h1>
      <p>Time until the next crossword drops:</p>
      <Row>
        <Countdown />
      </Row>
      <Row>
        <Button
          icon={<QuestionCircleOutlined />}
          href="//www.nytimes.com/crosswords/game/mini"
          style={{ margin: '0.5em' }}
          target="_blank"
        >
          {`Play Today's Puzzle`}
        </Button>
        <Button
          icon={<OrderedListOutlined />}
          href="//www.nytimes.com/puzzles/leaderboards"
          style={{ margin: '0.5em' }}
          target="_blank"
        >
          {`See Today's Leaderboard`}
        </Button>
        {/* <Badge.Ribbon text="No Update Today" color="red"> */}
        {/* TODO: a note here that says if the Plus Leaderboard has been updated today */}
      </Row>
    </>
  );
}


export { NytActionsComponents }
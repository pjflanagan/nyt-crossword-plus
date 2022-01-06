import React, { FC, useState, KeyboardEventHandler } from 'react';
import { Layout, Row, Input, Button, Divider, Alert } from 'antd';
import { TeamOutlined, LockOutlined, QuestionCircleOutlined, OrderedListOutlined, LoginOutlined } from '@ant-design/icons';
import sha256 from 'crypto-js/sha256';
import { toLower, trim } from 'lodash';

import { Countdown } from './countdown';
import { PageComponent } from '../page';

const { Header, Content } = Layout;

const MainComponent: FC = () => {

  // TODO: load cookies for which groups we have logged into

  const [groupName, setGroupName] = useState<string>('');
  // const [groupPassword, setGroupPassword] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = () => {
    if (groupName === '') { // groupPassword === '' || 
      setIsError(true);
      return;
    }
    // const hash = sha256(groupPassword).toString();
    const validatedGroupName = toLower(trim(groupName));

    // TODO: validate using the backend if this page exists and if the password
    // is correct, if it is then go to that page
    // maybe here we can store a cookie with allowed pages
    window.location.href = `${window.location.origin}/group/${validatedGroupName}`; // ?p=${hash}`;
  }

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  return (
    <PageComponent>
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

      <Divider />

      <h1>View a Group</h1>
      <p>{`Enter a group name and password to see a group's stats.`}</p>
      <Row>
        <Input
          style={{ margin: '0.5em 0', maxWidth: '480px' }}
          size="large"
          placeholder="Group Name"
          prefix={<TeamOutlined />}
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </Row>
      {/* <Row>
        <Input
          style={{ margin: '0.5em 0', maxWidth: '480px' }}
          size="large"
          placeholder="Group Password"
          prefix={<LockOutlined />}
          value={groupPassword}
          onChange={e => setGroupPassword(e.target.value)}
          onKeyPress={onKeyPress}
          type="password"
        />
      </Row> */}
      <Row>
        <Button
          icon={<LoginOutlined />}
          style={{ margin: '0.5em' }}
          type="primary"
          onClick={onSubmit}
        >
          See Group
        </Button>
      </Row>
      {
        isError && <Alert
          message="Error"
          description="Please enter a group name"
          type="error"
          closable
          style={{ maxWidth: '480px' }}
          onClose={() => setIsError(false)}
        />
      }
    </PageComponent>
  );
}


export { MainComponent }
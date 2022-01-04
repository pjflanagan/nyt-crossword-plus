import React, { FC, useState, KeyboardEventHandler } from 'react';
import { Layout, Row, Input, Button, Divider, Alert } from 'antd';
import { TeamOutlined, LockOutlined, QuestionCircleOutlined, OrderedListOutlined, LoginOutlined } from '@ant-design/icons';
import sha256 from 'crypto-js/sha256';

import { Countdown } from './countdown';

const { Header, Content } = Layout;

const MainComponent: FC = () => {

  const [groupName, setGroupName] = useState<string>('');
  const [groupPassword, setGroupPassword] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const onSubmit = () => {
    if (groupPassword === '' || groupName === '') {
      setIsError(true);
      return;
    }
    const hash = sha256(groupPassword).toString();

    // TODO: don't use replace, we want to be able to use the back button
    window.location.replace(`${window.location.origin}/group/${groupName}?p=${hash}`);
  }

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Header style={{ color: '#fff' }}>
        New York Times Crossword Leaderboard Plus
      </Header>
      <Content style={{ padding: '1em' }}>
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
        <Row>
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
        </Row>
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
            description="Please enter both a group name and a password"
            type="error"
            closable
            style={{ maxWidth: '480px' }}
            onClose={() => setIsError(false)}
          />
        }
      </Content>
    </Layout>

  )
}


export { MainComponent }
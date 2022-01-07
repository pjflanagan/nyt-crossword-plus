import React, { FC, useState } from 'react';
import { Row, Input, Button, Alert, Card } from 'antd';
import { TeamOutlined, LoginOutlined } from '@ant-design/icons'; // LockOutlined, QuestionCircleOutlined, OrderedListOutlined
// import sha256 from 'crypto-js/sha256';
import { toLower, trim } from 'lodash';

const GroupLoginComponent: FC = () => {

  // v2: load cookies for which groups we have logged into

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

    // v2: validate using the backend if this page exists and if the password
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
    <>
      <Row
        style={{ margin: '0.5em 0' }}
      >
        <Card
          title="View a Group"
          style={{ width: '100%' }}
        >
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
          {/* 
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
          */}
          <Row>
            <Button
              icon={<LoginOutlined />}
              style={{ margin: '0.5em 0' }}
              type="primary"
              onClick={onSubmit}
            >
              See Group Stats
            </Button>
          </Row>
        </Card>
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
    </>
  );
}


export { GroupLoginComponent }
import React, { FC } from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

type GroupComponentProps = {
  name: string;
}

const GroupComponent: FC<GroupComponentProps> = ({
  name
}) => {
  return (
    <Layout style={{ minHeight: '100%' }}>
      <Header style={{ color: '#fff' }}>
        New York Times Crossword Leaderboard Plus
      </Header>
      <Content style={{ padding: '1em' }}>
        <h1>{name}</h1>
      </Content>
    </Layout>
  );
}

export { GroupComponent }
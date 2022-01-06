import React, { FC, useState } from 'react';
import { Layout, Row } from 'antd';

const { Header, Content } = Layout;

import Style from './style.module.css';
import Link from 'next/link';

const PageComponent: FC = ({
  children
}) => {

  return (
    <Layout className={Style.layout}>
      <Header className={Style.header}>
        <Link href="/">
          New York Times Crossword Leaderboard Plus
        </Link>
      </Header>
      <Content className={Style.content}>
        {children}
      </Content>
    </Layout>

  )
}


export { PageComponent }
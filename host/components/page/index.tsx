import React, { FC } from 'react';
import Link from 'next/link';
import { Layout } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint'

import Style from './style.module.css';

const { Header, Content } = Layout;

const PageComponent: FC = ({
  children
}) => {

  const breakpoint = useBreakpoint();

  const pageTitle = (!breakpoint.md)
    ? 'NYT Crossword Plus'
    : 'New York Times Crossword Leaderboard Plus'

  return (
    <Layout className={Style.layout}>
      <Header className={Style.header}>
        <Link href="/">{pageTitle}</Link>
      </Header>
      <Content className={Style.content}>
        {children}
      </Content>
    </Layout>

  )
}


export { PageComponent }
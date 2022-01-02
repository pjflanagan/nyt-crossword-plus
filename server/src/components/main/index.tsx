import React, { FC, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Layout } from 'antd';

// import * as Style from './style.module.css';

const { Header, Content } = Layout; // Sider

const MainComponent: FC = () => {

  const [leaderboardData, setLeaderboardData] = useState<any>(null);

  useEffect(() => {
    if (isEmpty(leaderboardData)) {
      let newLeaderboardData;
      (async function () {
        try {
          // newWeatherData = await API.fetchWeatherData(coords);
          // console.log(newWeatherData);
        } catch (e) {
          // setErrorMessage(getRandomPhraseFromSection(errorUnableToFetchWeather));
          return;
        }
        setLeaderboardData(newLeaderboardData);
      })();
    }
  }, []);

  // useEffect(() => {
  //   if (leaderboardData) {
  //     // Make the display with the leaderboard data?
  //   }
  // }, [leaderboardData]);

  return (
    <Layout style={{ minHeight: '100%' }}>
      <Header style={{ color: '#fff' }}>
        New York Times Crossword Leaderboard Plus
      </Header>
      <Content style={{ padding: '1em' }}>
        Content
      </Content>
    </Layout>

  )
}


export { MainComponent }
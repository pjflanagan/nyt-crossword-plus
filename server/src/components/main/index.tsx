import React, { FC, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { Layout } from 'antd';

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
    <Layout>
      <Header>
        Header
      </Header>
      <Content>
        Content
      </Content>
    </Layout>

  )
}


export { MainComponent }
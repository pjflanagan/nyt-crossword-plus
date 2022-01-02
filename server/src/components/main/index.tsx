import React, { FC, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';

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
    <main>
    </main>
  )
}


export { MainComponent }
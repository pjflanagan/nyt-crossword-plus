
type TimeEntry = {
  username: string,
  date: string,
  time: number,
};

// export const getEntriesByDate = 

export const getPlacesByDayData = (entries: TimeEntry[]) => {
  // group by date
  // order by time within that date
  // number upwards, accounting for ties, on that date to get positions
}
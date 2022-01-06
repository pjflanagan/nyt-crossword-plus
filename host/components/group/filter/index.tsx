import moment from "moment";

export type Filter = {
  excludeSundays: boolean;
  startDate: moment.Moment;
  endDate: moment.Moment;
};

export const DEFAULT_FILTER: Filter = {
  excludeSundays: false,
  startDate: moment(),
  endDate: moment(),
};

// TODO: FilterComponentProps
// TODO: FilterComponent
// import { isEmpty } from 'lodash';
// import { TimeEntry } from 'types';
// import { getClient, readGroupTimesInRange } from 'db';

const handler = async (req, res) => {
  // const { groupName, startDate, endDate } = req.query;

  // // error check
  // if (isEmpty(groupName)) {
  //   return res.status(400).json({ errorMessage: `Query parameter (groupName) is required` });
  // } else if (isEmpty(startDate)) {
  //   return res.status(400).json({ errorMessage: `Query parameter (date) is required` });
  // }

  // let validatedEndDate = endDate;
  // // v2: if endDate is empty, then set validatedEndDate to today
  // // if (isEmpty(endDate)) {
  // //   validatedEndDate =
  // // }

  // // run query
  // const client = await getClient();
  // let entries: TimeEntry[];
  // try {
  //   entries = await readGroupTimesInRange(client, groupName, startDate, validatedEndDate);
  // } catch (e) {
  //   return res.status(500).json({ errorMessage: `DB Error: unable to load data, ${e}` });
  // }

  // respond
  return res.status(200).json({
    message: 'Coming soon'
  });
}

export default handler;

import faunadb from 'faunadb';

import { TimeEntryData } from '../../types';

const {
  Paginate,
  Match,
  Index,
  Map,
  Lambda,
  Var,
  Join,
  Select,
  Get
} = faunadb.query;

export const readGroupTimes = async (client: faunadb.Client, groupName: string) => {
  const entry: TimeEntryData = await client.query(
    Map(
      Paginate(
        Join(
          Match(Index('group_member_usernames_by_group_name'), groupName),
          Index('times_by_username')
        ),
        { size: 1000 }
      ),
      Lambda(
        'X',
        Select('data',
          Get(Var('X'))
        )
      )
    )
  );
  return entry.data;
}

// export const makeNewGroup -> adds a new group with password and a first group_cached_times entries

// export const readGroupByName = async (client: faunadb.Client, groupName: string) => {
//   const entry: TimeByDateIndex = await client.query(
//     Paginate(
//       Match(
//         Index('group_by_name'),
//         groupName
//       )
//     )
//   );
//   return entry.data;
// }

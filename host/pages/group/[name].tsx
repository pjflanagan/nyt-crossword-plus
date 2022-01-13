import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import moment from 'moment';

import { GroupComponent } from '../../components';
import { TimeEntry } from '../../types';

const DOMAIN = process.env.DOMAIN || '';

export default function PageGroup() {

  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  const router = useRouter()
  const { name } = router.query;

  useEffect(() => {
    const fetchInitData = async () => {

      if (!name) {
        return;
      }

      // const date = moment().subtract(7, 'days').format('YYYY-MM-DD');
      let url = encodeURI(`${DOMAIN}/api/readGroupTimes?groupName=${name}`); // &startDate=${date}
      if (name === 'test') {
        url = encodeURI(`${DOMAIN}/api/test`);
      }

      const resp = await fetch(url);
      let { entries: newEntries, errorMessage } = await resp.json();

      if (errorMessage && errorMessage !== '') {
        console.error(errorMessage);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setEntries(newEntries);
    };

    fetchInitData();
  }, [name]);

  return (
    <GroupComponent
      name={name as string}
      entries={entries}
      isLoading={isLoading}
    />
  );
}

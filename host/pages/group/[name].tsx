import { useRouter } from 'next/router';

import { GroupComponent } from '../../components';
import { TimeEntry } from '../../types';

const DOMAIN = process.env.DOMAIN || '';

export default function PageGroup({ entries }) {
  const router = useRouter()
  const { name } = router.query;

  return (
    <GroupComponent name={name as string} entries={entries as TimeEntry[]} />
  );
}

export async function getServerSideProps({ params }) {
  const { name } = params;

  let url = encodeURI(`${DOMAIN}/api/readGroupTimes?groupName=${name}`);
  if (name === 'test') {
    url = encodeURI(`${DOMAIN}/api/test`);
  }

  const resp = await fetch(url);
  let { entries, errorMessage } = await resp.json();

  if (errorMessage && errorMessage !== '') {
    console.error(errorMessage);
    entries = [];
  }

  return {
    props: {
      entries
    }
  }
}
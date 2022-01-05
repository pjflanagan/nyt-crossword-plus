import { useRouter } from 'next/router';

import { GroupComponent } from '../../components';

export default function PageGroup({ }) { // leaderboard
  const router = useRouter()
  const { name } = router.query;
  return (
    <>
      {/* leaderboard={leaderboard} */}
      <GroupComponent name={name as string} />
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { name } = params.name;

  // TODO: I can probably just write the fauna code here
  // but maybe shouldn't and instead write an api
  // const resp = await fetch
  // const data = await resp.json()

  const leaderboard = {};

  return {
    props: {
      leaderboard
    }
  }
}
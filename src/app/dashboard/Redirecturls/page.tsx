import React from 'react';
import MainPage from './MainPage';

import { fetchRedirectUrls } from 'config/general';

async function Page() {
  const Redirecturls = await fetchRedirectUrls();
  return <MainPage Redirecturls={Redirecturls} />;
}

export default Page;

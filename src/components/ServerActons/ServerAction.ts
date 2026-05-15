'use server';

import { revalidateTag as revalidate } from 'next/cache';

async function revalidateTag(name: string, profile: string = 'default') {
  revalidate(name, profile);
}

export default revalidateTag;

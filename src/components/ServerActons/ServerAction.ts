'use server';

import { revalidateTag as revalidate } from 'next/cache';

async function revalidateTag(name: string, tag: string = '') {
  revalidate(name, tag);
}

export default revalidateTag;

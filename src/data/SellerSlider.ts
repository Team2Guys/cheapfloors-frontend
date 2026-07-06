export interface ReelItem {
  // Instagram reel permalink. The slider renders the lightweight
  // `/embed` version of each in an iframe.
  url: string;
}

export const reelsData: ReelItem[] = [
  { url: 'https://www.instagram.com/reel/DX9hNFNiEep/' },
  { url: 'https://www.instagram.com/reel/DXKBgz-ikzT/' },
  { url: 'https://www.instagram.com/reel/DVBVhV_jEe8/' },
  { url: 'https://www.instagram.com/reel/DUyGYUUjDtj/' },
  { url: 'https://www.instagram.com/reel/DUvvUKMjS6y/' }, // skirting
  { url: 'https://www.instagram.com/reel/DUFyk1EjEpy/' },
  { url: 'https://www.instagram.com/reel/DTnv7VhE146/' }, // old prices (kept intentionally)
  { url: 'https://www.instagram.com/reel/DOLvdToACkd/' },
  { url: 'https://www.instagram.com/reel/DR4tNp2EYLD/' }, // herringbone
  { url: 'https://www.instagram.com/reel/DSFlMNWjSZ4/' },
  { url: 'https://www.instagram.com/reel/DSKowT7F3JO/' }
];

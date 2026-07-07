export interface ReelItem {
  videoUrl: string;
  videoPoster?: string;
}

// Reels are served from /public/assets/reels. Order: the last 5 (reel-07..reel-11) shown first.
export const reelsData: ReelItem[] = [
  {
    "videoUrl": "/assets/reels/reel-07.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-08.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-09.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-10.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-11.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-01.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-02.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-03.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-04.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-05.mp4"
  },
  {
    "videoUrl": "/assets/reels/reel-06.mp4"
  }
];

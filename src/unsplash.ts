import { UNSPLASH_ORIGIN, UNSPLASH_ACCESS_KEY } from "./consts";

export async function unsplashApi<T>(pathname: string, search = '') {
  const target = new URL(pathname, UNSPLASH_ORIGIN);
  target.search = search;

  const result = await fetch(target, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });

  if (!result.ok) {
    throw new Error(`Unsplash API ${result.status} ${result.statusText}`);
  }

  const links = (result.headers.get('link')?.split(',') || []).reduce((memo, link) => {
    const m = link.match(/(\?[^>]+)>; rel="(\w+)"/);
    return m ? {...memo, [m[2]]: m[1] } : memo;
  }, {});

  return result.json().then(data => ({
    data: data as T,
    ...links
  }));
};

// stolen from unsplash github
export interface Photo {
  id: string;
  created_at: string;
  updated_at: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description?: string;
  blur_hash?: string;
  color?: string;
  description?: string;
  height: number;
  likes: number;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  promoted_at?: string;
  width: number;
  user: {
    id: string;
    bio?: string;
    first_name: string;
    instagram_username?: string;
    last_name?: string;
    links: {
      followers: string;
      following: string;
      html: string;
      likes: string;
      photos: string;
      portfolio: string;
      self: string;
    };
    location?: string;
    name: string;
    portfolio_url?: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    total_collections: number;
    total_likes: number;
    total_photos: number;
    twitter_username?: string;
    updated_at: string;
    username: string;
  };
}
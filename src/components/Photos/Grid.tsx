import { useEffect, useState, useRef } from "react";
import type { Photo } from "../../unsplash";

type PhotoGridProps = {
  search?: string;
};

export default function PhotoGrid({ search }: PhotoGridProps) {
  const [photos, setPhotos] = useState<Photo[] | undefined>();
  const [pagination, setPagination] = useState<{
    page?: number;
    next?: string;
    prev?: string;
  }>({});

  useEffect(() => {
    const params = new URLSearchParams(search);
    const page = parseInt(params?.get("page") ?? "1", 10);
    const query = encodeURIComponent(params?.get("query") ?? "");
    const order_by = params?.get("order_by") ?? "latest";

    let url = query ? `/api/search/photos?query=${query}&` : `/api/photos?`;
    url += `page=${page}&order_by=${order_by}`;

    fetch(url)
      .then((result) => result.json())
      .then(({ data, ...links }) => {
        setPagination((p) => ({ ...p, page, ...links }));
        setPhotos(query ? data.results : data);
      });
  }, [search]);

  const { page, next, prev } = pagination;

  if (!page) {
    return <div className="loading loading-dots" />;
  }

  if(page && !photos?.length) {
    return <div className="badge badge-lg badge-outline">no results! try a different query</div>;
  }

  return (
    <ul className={`grid grid-cols-4 gap-4`}>
      {photos && (
        <li className="flex items-center justify-center card card-compact aspect-square w-42">
          <a
            className={`btn h-full w-full${!prev ? " btn-disabled" : ""}`}
            href={prev}
            aria-disabled={!prev}
          >
            previous page
          </a>
        </li>
      )}
      {photos?.map((one) => (
        <li key={one.id} className="hover:scale-105 transition-transform">
          <a
            href={`/photos/${one.id}`}
            className="card card-compact aspect-square w-42 shadow-xl overflow-hidden"
          >
            <figure className="w-full h-full">
              <img
                src={one.urls.thumb}
                alt={one.alt_description}
                className="w-full h-full object-cover"
              />
            </figure>
          </a>
        </li>
      ))}
      {photos && (
        <li className="flex items-center justify-center card card-compact aspect-square w-42">
          <a
            className={`btn h-full w-full${!next ? " btn-disabled" : ""}`}
            aria-disabled={!next}
            href={next}
          >
            next page
          </a>
        </li>
      )}
    </ul>
  );
}

import type { APIRoute } from "astro";
import { unsplashApi } from "../../unsplash";

export const GET: APIRoute = async ({ request }) => {
  const { pathname, search } = new URL(request.url);

  const result = await unsplashApi(pathname.replace(/^\/api/, ""), search);

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

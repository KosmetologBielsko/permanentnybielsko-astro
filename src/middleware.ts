import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  if (url.hostname === "permanentnybielsko.com") {
    url.hostname = "www.permanentnybielsko.com";

    return Response.redirect(url.toString(), 308);
  }

  return next();
});
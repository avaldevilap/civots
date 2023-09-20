import { rest } from "msw";
import { createRandomRegion } from "./utils";

export const handlers = [
  rest.get("https://api.civo.com/v2/regions", (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json(Array.from({ length: 5 }).map(() => createRandomRegion())),
    ),
  ),
];

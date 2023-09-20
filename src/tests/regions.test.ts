import { expect, test, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "../mocks/server";
import { Civo } from "..";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const client = new Civo({ apiKey: "kjahfdkasdkhaskdjah" });

test("get all regions", async () => {
  const regions = await client.regions.listRegions();

  expect(regions.length).toBeGreaterThan(0);
});

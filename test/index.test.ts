import exp from "constants";
import { LookAheadStore } from "../src/index";

test("adds and retreives one value", async () => {
  const idToUuid = new LookAheadStore<string>();

  idToUuid.put("1", "one");

  const value = await idToUuid.get("1");

  expect(value).toBe("one");
});

test("adds and retreives several values", async () => {
  const idToUuid = new LookAheadStore<string>();

  idToUuid.put("1", "one");
  idToUuid.put("2", "two");
  idToUuid.put("3", "three");

  const value1 = await idToUuid.get("1");
  const value2 = await idToUuid.get("2");
  const value3 = await idToUuid.get("3");

  expect(value1).toBe("one");
  expect(value2).toBe("two");
  expect(value3).toBe("three");
});

test("retreives then adds one value", async () => {
  const idToUuid = new LookAheadStore<string>();

  idToUuid.get("1").then(value => {
    expect(value).toBe("one");
  });

  idToUuid.put("1", "one");
});

test("retreives then adds several value", async () => {
  const idToUuid = new LookAheadStore<string>();

  idToUuid.get("1").then(value => {
    expect(value).toBe("one");
  });

  idToUuid.put("1", "one");
  idToUuid.put("2", "two");

  idToUuid.get("2").then(value => {
    expect(value).toBe("two");
  });

  idToUuid.get("3").then(value => {
    expect(value).toBe("three");
  });

  idToUuid.put("3", "three");
});


test("Can force resolve hanging promises", async () => {
  const las = new LookAheadStore<string>();

  las.get("1").then(value => {
    // will get resolved after `las.forceResolve()` is called
    expect(value).toEqual("foo")
  })
  expect(las.unresolved.has("1")).toBeTruthy()
  las.forceResolve("foo")
  expect(las.unresolved.has("1")).toBeFalsy()

  // ensure `unresolved` is truthful
  las.get("2").then(value => {
    expect(value).toEqual("two")
    expect(las.unresolved.has("2")).toBeFalsy()
  })
  las.put("2", "two")
});

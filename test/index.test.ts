import { lookAheadFactory } from "../src/index";

test("adds and retreives one value", async () => {
  const idToUuid = lookAheadFactory();

  idToUuid.putValue(1, "one");

  const value = await idToUuid.getValue(1);

  expect(value).toBe("one");
});

test("adds and retreives several values", async () => {
  const idToUuid = lookAheadFactory();

  idToUuid.putValue(1, "one");
  idToUuid.putValue(2, "two");
  idToUuid.putValue(3, "three");

  const value1 = await idToUuid.getValue(1);
  const value2 = await idToUuid.getValue(2);
  const value3 = await idToUuid.getValue(3);

  expect(value1).toBe("one");
  expect(value2).toBe("two");
  expect(value3).toBe("three");
});

test("retreives then adds one value", async () => {
  const idToUuid = lookAheadFactory();

  idToUuid.getValue(1).then(value => {
    expect(value).toBe("one");
  });

  idToUuid.putValue(1, "one");
});

test("retreives then adds several value", async () => {
  const idToUuid = lookAheadFactory();

  idToUuid.getValue(1).then(value => {
    expect(value).toBe("one");
  });

  idToUuid.putValue(1, "one");
  idToUuid.putValue(2, "two");

  idToUuid.getValue(2).then(value => {
    expect(value).toBe("two");
  });

  idToUuid.getValue(3).then(value => {
    expect(value).toBe("three");
  });

  idToUuid.putValue(3, "three");
});

import type { Either } from "./either";
import { left, right } from "./either";

function doSamething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) return right(10);
  else return left("error");
}

test("success result", () => {
  const result = doSamething(true);

  expect(result.isRight()).toBe(true);
  expect(result.isLeft()).toBe(false);
});

test("error result", () => {
  const result = doSamething(false);

  expect(result.isLeft()).toBe(true);
  expect(result.isRight()).toBe(false);
});

export class UnknowError extends Error {
  constructor(data: any) {
    super(JSON.stringify(data));
  }
}

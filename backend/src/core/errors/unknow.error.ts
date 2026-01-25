export class UnknownError extends Error {
  constructor(data: any) {
    super(JSON.stringify(data));
  }
}

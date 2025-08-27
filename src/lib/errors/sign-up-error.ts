export class SignUpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignUpError";
  }
}

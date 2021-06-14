import {Response} from '.';

export class ErrorResponse extends Response {
  constructor(msg: string, ephemeral = true) {
    super(msg, ephemeral);

    this.msg = this.format(msg);
  }

  format(msg: string): string {
    return `:x: ${msg}`;
  }

  static permissionError(ephemeral = true) {
    return new this(
      'You do not have permission to use this command.',
      ephemeral
    );
  }

  static genericError(ephemeral = true) {
    return new this('An error occurred, please try again.', ephemeral);
  }
}

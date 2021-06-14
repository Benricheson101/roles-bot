import {Response} from '.';

export class SuccessResponse extends Response {
  constructor(msg: string, ephemeral = true) {
    super(msg, ephemeral);
  }

  format(msg: string): string {
    return `:white_check_mark: ${msg}`;
  }
}

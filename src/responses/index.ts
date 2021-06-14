import {APIInteractionResponse} from 'discord-api-types';

export class Response {
  public msg: string;

  constructor(msg: string, public readonly ephemeral = true) {
    this.msg = this.format(msg);
  }

  format(msg: string): string {
    return msg;
  }

  public toJSON(): APIInteractionResponse {
    return {
      type: 4,
      data: {
        content: this.msg,
        flags: this.ephemeral ? 64 : 0,
      },
    };
  }
}

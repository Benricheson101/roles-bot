import {
  APIApplicationCommand,
  APIDMInteraction,
  APIGuildInteraction,
  Snowflake,
} from 'discord-api-types';
import {Request, Response} from 'express';

import {CONFIG_COMMAND} from './config';
import {PING_CMD} from './ping';

export type Command = Omit<APIApplicationCommand, 'id' | 'application_id'> & {
  guild?: Snowflake;
  handler: (
    req: Request<{}, {}, APIGuildInteraction | APIDMInteraction>,
    res: Response
  ) => Promise<unknown>;
};

export const COMMANDS = [CONFIG_COMMAND, PING_CMD];

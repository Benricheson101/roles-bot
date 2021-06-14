import 'reflect-metadata';
import express, {Request, Response} from 'express';
import {verifyAndAck} from './server/verify';
import {APIGuildInteraction} from 'discord-api-types';
import {registerCmds} from './util/registerCmds';
import {COMMANDS} from './cmds';
import {createConnection} from 'typeorm';
import axios from 'axios';

const PORT = process.env.PORT || 3000;

const client = axios.create({
  baseURL: 'https://discord.com/api/v9',
  validateStatus: null,
});

if (process.env.NODE_ENV === 'prod') {
  registerCmds(
    {
      clientSecret: process.env.CLIENT_SECRET!,
      clientId: process.env.CLIENT_ID!,
    },
    COMMANDS
  )
    .then(cmds => {
      console.log(
        `  => Created ${cmds.global.length} global command${
          cmds.global.length === 1 ? '' : 's'
        }`
      );

      console.log(
        `  => Created ${cmds.guild.length} guild command${
          cmds.guild.length === 1 ? '' : 's'
        }`
      );
    })
    .catch(console.error);
}

const app = express();

app.use(express.json());

app.post(
  '/cmds',
  verifyAndAck(process.env.PUBLIC_KEY!),
  async (req: Request, res: Response) => {
    if (req.body.type === 2) {
      const i = req.body as APIGuildInteraction;

      const cmdName = i.data?.name;

      const cmd = COMMANDS.find(c => c.name === cmdName);

      if (!cmd) {
        return res.status(404).send('Command not found.');
      }

      try {
        const output = (await cmd.handler(req, res)) as Record<string, unknown>;

        // TODO: this is actually stupid and so incredibly dumb but it works
        if (
          output.constructor.name.endsWith('Response') &&
          output.constructor.name !== 'ServerResponse'
        ) {
          return res.status(200).json(output);
        }
      } catch (e) {
        console.log(e);

        return res.status(500);
      }
    }

    return;
  }
);

createConnection().then(async () => {
  app.listen(PORT, () => console.log('  => Listening on port:', PORT));
});

export interface AuthOptions {
  clientSecret: string;
  clientId: string;
}

// // -- NEED TO STORE --
// //   - GUILDS -
// //     - guild_id
// //     - blocked = false
// //
// //   - ROLE MENUS -
// //     - guild_id
// //     - menu_id
// //
// //   - ROLE MENU PAGE -
// //     - menu_id
// //     - page_id
// //     - role
// //
// //   - ROLE MENU PAGE ROW -
// //     - page_id
// //     - row_id
// //     - layout
// //
// //   - ROLE MENU PAGE ROW ROLE -
// //     - row_id
// //     - role_id
// //     - label
// //     - description?
// //     - emoji?

// TODO: simple config:
//   - only hone page
//   - simple add name:my_menu role:123
//   - simple remove name:my_menu role:123

import {AuthOptions} from '..';
import {Command} from '../cmds';
import {stringify} from 'querystring';
import axios from 'axios';
import {APIApplicationCommand} from 'discord-api-types';

const client = axios.create({
  baseURL: 'https://discord.com/api/v9',
  validateStatus: null,
});

const exclude = <T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
) => {
  const newObj = {...obj};

  for (const key of keys) {
    delete newObj[key];
  }

  return newObj;
};

export async function registerCmds(
  {clientSecret, clientId}: AuthOptions,
  cmds: Command[]
): Promise<{guild: APIApplicationCommand[]; global: APIApplicationCommand[]}> {
  const body = {
    grant_type: 'client_credentials',
    scope: 'applications.commands.update',
  };

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const auth = {
    username: clientId,
    password: clientSecret,
  };

  const {data} = await client.post('/oauth2/token', stringify(body), {
    headers,
    auth,
  });

  const c = cmds.map(c => exclude(c, ['handler']));

  const out: {guild: APIApplicationCommand[]; global: APIApplicationCommand[]} =
    {guild: [], global: []};

  if (process.env.NODE_ENV === 'dev' && process.env.GUILD) {
    const r = await client.put(
      `/applications/${clientId}/guilds/${process.env.GUILD}/commands`,
      c,
      {
        headers: {authorization: `Bearer ${data.access_token}`},
      }
    );

    out.guild = r.data;

    return out;
  }

  const globalCmds = c.filter(c => !c.guild);
  const guildCmds = c.filter(c => c.guild);

  if (globalCmds.length) {
    const r = await client.put(
      `/applications/${clientId}/commands`,
      globalCmds,
      {
        headers: {authorization: `Bearer ${data.access_token}`},
      }
    );

    out.global = r.data;
  }

  if (guildCmds.length) {
    for (const guildCmd of guildCmds) {
      const r = await client.post(
        `/applications/${clientId}/guilds/${guildCmd.guild}/commands`,
        guildCmd,
        {
          headers: {authorization: `Bearer ${data.access_token}`},
        }
      );

      out.guild.push(r.data);
    }
  }

  return out;
}

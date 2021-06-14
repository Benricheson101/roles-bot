import {Command} from '.';

export const PING_CMD: Command = {
  name: 'ping',
  description: 'Pong!',

  async handler(_req, res) {
    return res.status(200).json({type: 4, data: {content: 'Pong!'}});
  },
};

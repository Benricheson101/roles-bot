import {verify} from 'noble-ed25519';
import {Request, Response, NextFunction} from 'express';
import {APIInteractionResponse} from 'discord-api-types';

export function verifyAndAck(publicKey: string) {
  return async function (
    req: Request<{}, {}, APIInteractionResponse>,
    res: Response,
    next: NextFunction
  ) {
    const sig = req.headers['x-signature-ed25519']! as string;
    const time = req.headers['x-signature-timestamp']! as string;
    const body = JSON.stringify(req.body);

    if (!(sig && time && body)) {
      return res.status(401).send('Unauthorized');
    }

    const isValid = await verify(
      sig,
      Buffer.concat([Buffer.from(time), Buffer.from(body)]),
      publicKey
    );

    if (!isValid) {
      return res.status(401).send('Unauthorized');
    }

    if (req.body.type === 1) {
      return res.status(200).json({type: 1});
    }

    return next();
  };
}

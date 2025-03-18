import { Payload } from '../interface/payload.interface';

export type RequestWithUser = Request & {
  user: Payload;
};

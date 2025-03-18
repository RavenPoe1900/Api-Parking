import { IPayload } from '../interface/payload.interface';

export type RequestWithUser = Request & {
  user: IPayload;
};

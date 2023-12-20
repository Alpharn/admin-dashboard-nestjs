import { Request as RequestType } from 'express';

export function extractJWT(req: RequestType): string | null {
  return req.cookies?.token || null;
}

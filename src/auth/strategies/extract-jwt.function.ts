import { Request as RequestType } from 'express';

export function extractJWT(req: RequestType): string | null {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  return req.cookies?.token || null;
}
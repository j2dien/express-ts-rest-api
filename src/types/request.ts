import { Request } from "express";

/**
 * Generic helper untuk Express Request dengan type-safe params/body/query
 */
export type TypedRequest<
  Params = Record<string, string>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Record<string, string>
> = Request<Params, ResBody, ReqBody, ReqQuery>;

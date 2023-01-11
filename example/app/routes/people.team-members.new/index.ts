import { app, Context } from "appy";

export interface ActionData {
}

export function post(c: Context) {
  app.logger.info(c.req.url);

  return c.text(c.req.url);
}

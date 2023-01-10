import { app } from "appy";

export interface ActionData {
  a: string;
}

export default () => {
  app.logger.info("hello world");
};

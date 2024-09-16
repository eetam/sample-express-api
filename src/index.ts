import "dotenv/config";
import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "./config/inversify.config";
import { serverConfig, serverErrorConfig } from "./config/server.config";
import { Logger } from "./config/logger.config";

export async function Bootstrap() {
  const server = new InversifyExpressServer(container);
  server.setConfig(serverConfig);
  server.setErrorConfig(serverErrorConfig);

  const app = server.build();
  app.listen(3000, () =>
    new Logger().info("Server started on http://127.0.0.1:3000/")
  );
}

Bootstrap();

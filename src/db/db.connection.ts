import { connect, connection } from "mongoose";
import { injectable } from "inversify";
import { Logger } from "../config/logger.config";

@injectable()
export class DatabaseConnection {
  private readonly logger: Logger = new Logger(DatabaseConnection.name);

  public async initConnection(): Promise<void> {
    process.env.DB_CONN_STR = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    await this.connect(process.env.DB_CONN_STR);
  }

  public async connect(connectionString: string): Promise<void> {
    connect(connectionString);

    connection.on("connected", () => {
      this.logger.info(`mongoose connected to ${connectionString}`);
    });

    connection.on("error", (err) => {
      this.logger.error(`mongoose connection error: ${err}`);
    });

    connection.on("disconnected", () => {
      this.logger.error("mongoose disconnected trying to reconnect...");
      this.connect(process.env.DB_CONN_STR);
    });
  }
}

import { injectable, inject, Container } from "inversify";
import { ICommandHandler } from "./command.handler.interface";

@injectable()
export class CommandMediator {
  private handlers = new Map<string, ICommandHandler<any, any>>();

  constructor(@inject(Container) private container: Container) {}

  public registerHandler<TCommand, TResult>(
    commandType: string,
    handlerType: any
  ): void {
    const handler =
      this.container.get<ICommandHandler<TCommand, TResult>>(handlerType);
    this.handlers.set(commandType, handler);
  }

  public async execute<TCommand, TResult>(command: TCommand): Promise<TResult> {
    const commandType = command.constructor.name;
    const handler = this.handlers.get(commandType);
    if (!handler) {
      throw new Error(`No handler registered for command: ${commandType}`);
    }
    return await handler.handle(command);
  }
}

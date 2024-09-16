import { injectable, inject, Container } from "inversify";
import { IQueryHandler } from "./query.handler.interface";

@injectable()
export class QueryMediator {
  private handlers = new Map<string, IQueryHandler<any, any>>();

  constructor(@inject(Container) private container: Container) {}

  public registerHandler<TQuery, TResult>(
    queryType: string,
    handlerType: any
  ): void {
    const handler =
      this.container.get<IQueryHandler<TQuery, TResult>>(handlerType);
    this.handlers.set(queryType, handler);
  }

  public async execute<TQuery, TResult>(query: TQuery): Promise<TResult> {
    const queryType = query.constructor.name;
    const handler = this.handlers.get(queryType);
    if (!handler) {
      throw new Error(`No handler registered for query: ${queryType}`);
    }
    return await handler.handle(query);
  }
}

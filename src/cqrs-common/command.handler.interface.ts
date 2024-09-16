export interface ICommandHandler<TCommand, TResult> {
  handle(command: TCommand): TResult;
}

export interface IQueryHandler<TQuery, TResult> {
  handle(query: TQuery): TResult;
}

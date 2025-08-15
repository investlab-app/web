import type {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
  QueryOptions,
} from '@tanstack/react-query';

export type TokenSource =
  | string
  | null
  | (() => string | undefined | null)
  | (() => Promise<string | undefined | null>);

const resolveToken = async (src: TokenSource): Promise<string> => {
  const t =
    !src || typeof src === 'string' ? src : await Promise.resolve(src());
  if (!t) throw new Error('Not authenticated');
  return t;
};

type UserQueryFn<TData, TQueryKey extends QueryKey> = (
  token: string,
  ctx?: QueryFunctionContext<TQueryKey>
) => Promise<TData>;

type BuiltOptions<TData, TError, TQueryKey extends QueryKey> = Omit<
  QueryOptions<TData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn'
> & {
  queryKey: TQueryKey;
  queryFn: QueryFunction<TData, TQueryKey>;
};

export function authedQueryOptions<
  TData,
  TError = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(
  opts: {
    queryKey: TQueryKey;
    queryFn: UserQueryFn<TData, TQueryKey>;
  } & Omit<
    QueryOptions<TData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >
) {
  const { queryKey, queryFn, ...rest } = opts;

  return function build(
    tokenSource: TokenSource,
    overrides?: Omit<
      BuiltOptions<TData, TError, TQueryKey>,
      'queryKey' | 'queryFn'
    >
  ): BuiltOptions<TData, TError, TQueryKey> {
    const wrapped: QueryFunction<TData, TQueryKey> = async (ctx) => {
      const token = await resolveToken(tokenSource);
      return queryFn(token, ctx);
    };

    return {
      queryKey,
      queryFn: wrapped,
      ...rest,
      ...(overrides ?? {}),
    };
  };
}

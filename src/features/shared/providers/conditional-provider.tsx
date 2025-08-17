type ConditionalProviderProps<T> = {
  condition: boolean;
  provider: React.ComponentType<T>;
  providerProps?: T;
  children: React.ReactNode;
};

export function ConditionalProvider<T>({
  condition,
  provider: Provider,
  providerProps,
  children,
}: ConditionalProviderProps<T>) {
  return condition ? (
    <Provider {...(providerProps as T)}>{children}</Provider>
  ) : (
    <>{children}</>
  );
}

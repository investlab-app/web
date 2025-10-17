interface ConditionalProps<T> {
  condition: boolean;
  component: React.ComponentType<T>;
  props?: T;
  children: React.ReactNode;
}

export function Conditional<T>({
  condition,
  component: Component,
  props,
  children,
}: ConditionalProps<T>) {
  return condition ? (
    <Component {...(props as T)}>{children}</Component>
  ) : (
    <>{children}</>
  );
}

import { useEffect, useRef } from 'react';

export function useFrozenValue<T>(value: T, freeze: boolean) {
  const ref = useRef(value);
  useEffect(() => {
    if (!freeze) ref.current = value;
  }, [value, freeze]);
  return freeze ? ref.current : value;
}

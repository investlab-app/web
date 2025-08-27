import { useIsMinWidth } from './use-is-min-width';

const _2XL_BREAKPOINT = 1536;

export function useIs2XL() {
  return useIsMinWidth(_2XL_BREAKPOINT);
}

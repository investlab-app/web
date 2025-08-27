import { useIsMinWidth } from './use-is-min-width';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return !useIsMinWidth(MOBILE_BREAKPOINT);
}

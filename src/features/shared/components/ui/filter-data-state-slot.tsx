import React, { forwardRef } from 'react';

/** This filter slot prevents the Tooltip and Popoer from overwriting
 * its children's "data-state" attribute, ensuring that child components
 * can maintain their own state without interference.
 * Reference: https://github.com/shadcn-ui/ui/issues/1988 */
export const FilterDataStateSlot = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<Record<string, unknown>>
>((props, ref) => {
  const { 'data-state': unused, children, ...otherProps } = props;
  void unused;
  return React.cloneElement(
    children as React.ReactElement<Record<string, unknown>>,
    {
      ref,
      ...otherProps,
    }
  );
});

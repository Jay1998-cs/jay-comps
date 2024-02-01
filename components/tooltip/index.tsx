// remove this after RcTooltip switch visible to open.
interface LegacyTooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: boolean;
  afterOpenChange?: boolean;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: boolean;
  afterVisibleChange?: boolean;
}

export interface AbstractTooltipProps extends LegacyTooltipProps {
  style?: React.CSSProperties;
  className?: string;
  rootClassName?: string;
  color?: string;
  placement?: any;
  builtinPlacements?: any;
  openClassName?: string;
  /** @deprecated Please use `arrow={{ pointAtCenter: true }}` instead. */
  arrowPointAtCenter?: boolean;
  arrow?:
    | boolean
    | {
        /** @deprecated Please use `pointAtCenter` instead. */
        arrowPointAtCenter?: boolean;
        pointAtCenter?: boolean;
      };
  autoAdjustOverflow?: boolean | any;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  children?: React.ReactNode;
  destroyTooltipOnHide?: boolean | { keepParent?: boolean };
}

export interface TooltipPropsWithOverlay extends AbstractTooltipProps {
  title?: React.ReactNode;
  overlay?: React.ReactNode;
}

export interface TooltipPropsWithTitle extends AbstractTooltipProps {
  title: React.ReactNode;
  overlay?: React.ReactNode;
}

export declare type TooltipProps =
  | TooltipPropsWithTitle
  | TooltipPropsWithOverlay;

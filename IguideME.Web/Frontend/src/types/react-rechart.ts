interface PayloadItem {
  value: number;
  [key: string]: unknown;
}

interface TooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
}

export type { PayloadItem, TooltipProps };

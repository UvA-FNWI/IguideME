export type PayloadItem = { value: number; [key: string]: any };

export type TooltipProps = {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
};

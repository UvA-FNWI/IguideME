export type DashboardColumnWidth = "small" | "large" | "medium" | "fullwidth";

export interface DashboardColumn {
  id: number;
  position: number;
  container_width: DashboardColumnWidth;
}
export type LayoutColumn = {
    width: number;
    id: number;
    position: number;
    groups: string[];
}

export type TileGroup = {
    id: number;
    title: string;
    position: number;
    column_id: number;
}

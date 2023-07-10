export interface IProps {
    row_data: string[];
    row_index: number;
    columns: {grade: number, id: number};
    changeData: (value:string, row_index: number, col_index: number) => void;
}

export interface IState {

}

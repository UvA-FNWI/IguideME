export interface HistoricTileGrades {
    dates: string[],
    user_avg: number[],
    peer_avg: number[],
    peer_max: number[],
    peer_min: number[],
}


export interface IProps {
    historicGrades: HistoricTileGrades | undefined
}

export interface IState {
}

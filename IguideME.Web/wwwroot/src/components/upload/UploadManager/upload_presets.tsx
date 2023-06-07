export default class Presets {
    static filter(data: string[][], skip_rows: number, id_col: number, grade_col: number) {
        let filtered_data = [];

        for (let i = skip_rows; i < data.length; i++) {
            filtered_data.push([data[i][id_col], data[i][grade_col]])
        }
        return filtered_data;
    }

    static watched(data: string[][]): string[][] {
        return this.filter(data, 6, 0, 11);
    }

    static watchtime(data: string[][]): string[][] {
        return this.filter(data, 6, 0, 4);
    }

    static sowiso(data: string[][]): string[][] {
        return this.filter(data, 1, 1, 5);
    }
}

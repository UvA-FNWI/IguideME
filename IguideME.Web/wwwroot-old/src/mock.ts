import { debug } from "./config/config"

export class Mock {
    enabled = true

    constructor(enabled: boolean) {
        this.enabled = enabled && debug()
    }
}

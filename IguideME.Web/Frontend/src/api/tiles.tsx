import apiClient from "./axios"
import { LayoutColumn, TileGroup } from "@/types/tile";

export let getLayoutColumns: () => Promise<LayoutColumn[]> = () => apiClient.get(
    `layout/columns`
  ).then(response => {
    // TODO: change backend so that this is unnecessary
    let data = response.data as LayoutColumn[]
    for (let i = 0; i < data.length; i++) {
      if (data[i].groups === undefined) {
        data[i].groups = ['1']
      }
    }
    return response.data});

export let postLayoutColumns: (layouts: LayoutColumn[]) => Promise<void> = (layouts: LayoutColumn[]) => apiClient.post(
  `layout/columns`, layouts
);


export let getTileGroups: () => Promise<TileGroup[]> = () => apiClient.get(
    `tiles/groups`
  ).then(response => response.data);


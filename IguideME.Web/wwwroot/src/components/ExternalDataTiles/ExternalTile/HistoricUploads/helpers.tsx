import React from "react";
import {ColumnsType} from "antd/lib/table";
import {Tile, TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import GradeBar from "../../../visuals/GradesOverviewBar/GradeBar";
import {Button, Space} from "antd";
import Swal from 'sweetalert2';
import TileController from "../../../../api/controllers/tile";

const compute = require( 'compute.io' );

export const getColumns = (viewData: (obj: TileEntry) => any, reload: () => any): ColumnsType<object> => {
  return [
    {
      title: 'Source name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Rows',
      dataIndex: 'rows',
      key: 'rows',
    },
    {
      title: 'Average',
      dataIndex: 'average',
      key: 'average',
    },
    {
      title: 'Std. dev',
      dataIndex: 'stdev',
      key: 'stdev',
    },
    {
      title: 'Skewness',
      dataIndex: 'skewness',
      key: 'skewness',
      render: (value) => {
        return isNaN(value) ? "0" : value;
      }
    },
    {
      width: 200,
      title: 'Scores',
      render: (value, object: any) => {
        return <GradeBar grades={object.grades}
                         binary={object.binaryGrades}
                         withLegend={false}
                         height={100}
        />
      }
    },
    {
      title: 'Actions',
      render: (_, object: any) => {
        return (
          <Space>
            <Button onClick={() => viewData(object._rawEntry)}>View Data</Button>
            <Button className={"dangerButtonStyle"}
                    onClick={() => Swal.fire({
                      title: 'Do you really want to delete this data?',
                      text: `All data from "${object.title}" will be lost indefinitely!`,
                      icon: 'warning',
                      focusCancel: true,
                      showCancelButton: true,
                      confirmButtonText: 'Delete',
                      cancelButtonText: 'Cancel',
                      customClass: {
                        confirmButton: 'historicUploadConfirm',
                        cancelButton: 'historicUploadCancel',
                      }
                    }).then((result) => {
                      if (result.value) {
                        TileController.deleteTileEntry(object._rawEntry.id).then(() => {
                          reload();
                          Swal.fire(
                            'Entries deleted!',
                            '',
                            'success',
                          );
                        });
                      } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire(
                          'Cancelled',
                          'The data has been preserved!',
                          'error'
                        )
                      }
                    }
                  )
                }
            >
              Delete
            </Button>
          </Space>
        )
      }
    },
  ]
}

export const formatData = (tile: Tile, entries: TileEntry[], submissions: TileEntrySubmission[]): any => {

  return entries.map((entry, i) => {
    const s = submissions.filter(x => x.entry_id === entry.id);
    const grades: number[] = s.map(x => parseFloat(x.grade));

    return {
      _rawEntry: entry,
      title: entry.title,
      key: i,
      rows: s.length,
      grades: grades,
      binaryGrades: tile ? tile.content === "BINARY" : false,
      average: Math.round((compute.mean(grades) * 100)) / 100,
      stdev: Math.round((compute.stdev(grades) * 100)) / 100,
      skewness: Math.round((compute.skewness(grades) * 100)) / 100,
    }
  });
}

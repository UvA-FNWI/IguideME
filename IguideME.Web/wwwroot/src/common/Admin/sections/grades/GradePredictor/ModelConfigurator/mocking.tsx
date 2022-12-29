import {Mock} from "../../../../../../mock";
import { GradesDatasets, StudentGrades } from "../types";
import { GradePredictionModel } from "./interfaces";

export class LinkLiveDataMock extends Mock {
    mockGradesDatasetTilePairs = true;

    gradesDatasetTilePairs =
      this.enabled && this.mockGradesDatasetTilePairs
        ? JSON.parse(
            '{"presentatie":2,"deeltoets3":4,"deeltoets2":7,"deeltoets1":1}'
          )
        : {};
  }

export class UploadDataMock extends Mock {
    mockGradesDatasets = true
    mockFinalGradesDatasetName = true

    gradesDatasets = (this.enabled && this.mockGradesDatasets) ? JSON.parse('{"presentatie":{"1":7.9,"2":8.1,"3":8.3,"4":7,"5":7,"6":7,"7":8.3,"8":8.3,"9":9.3,"10":8.1,"11":8.9,"12":8.3,"13":9.3,"14":8.3,"15":8.9,"16":1,"17":9.6,"18":8.5,"19":8.3,"20":8.7,"21":9.3,"22":9.3,"23":8.3,"24":7.9,"25":6.6,"26":8.7,"27":8.9,"28":8.7,"29":7.6,"30":8.3,"31":8.3,"32":8.3,"33":8.9,"34":9.3,"35":8.9,"36":7.4,"37":7.4,"38":8.1,"39":8.3,"40":1,"41":9.3,"42":8.1,"43":9.6,"44":8.9,"45":1,"46":7.2,"47":9.3,"48":8.3,"49":7.4,"50":7.8,"51":9.3,"52":9.3,"53":8.3,"54":9.3,"55":7.6,"56":9.3,"57":8.3,"58":9.3,"59":8.3},"eindcijfer":{"1":1,"2":1,"3":7.2,"4":6.5,"5":6.1,"6":1,"7":1,"8":7.1,"9":7,"10":7.5,"11":8,"12":7.1,"13":7.2,"14":6,"15":8.8,"16":1,"17":7.1,"18":8.2,"19":7.7,"20":7.5,"21":7.9,"22":8.5,"23":6.3,"24":6.9,"25":5.3,"26":7.2,"27":6.7,"28":8.3,"29":6.1,"30":1,"31":7.9,"32":6.5,"33":7.1,"34":7.3,"35":7.3,"36":7.2,"37":7.5,"38":7.1,"39":6.3,"40":1,"41":8.7,"42":6.5,"43":7.1,"44":6.8,"45":1,"46":1,"47":7.8,"48":6.5,"49":6.9,"50":1,"51":7.6,"52":8,"53":6.3,"54":7.1,"55":5.7,"56":8.7,"57":8.8,"58":8.7,"59":6.4},"deeltoets3":{"1":3.1,"2":7.2,"3":6.7,"4":6.9,"5":5.3,"6":1,"7":5.7,"8":7,"9":6.7,"10":6.7,"11":7.3,"12":6,"13":7.3,"14":5.2,"15":8.8,"16":1,"17":7.3,"18":7.1,"19":7.2,"20":7.1,"21":7.6,"22":7.9,"23":6.7,"24":7.7,"25":5.8,"26":7.6,"27":6,"28":7.5,"29":6.4,"30":8.2,"31":8.3,"32":6.8,"33":6.6,"34":8.1,"35":6.2,"36":7.6,"37":6.7,"38":6.5,"39":6.6,"40":1,"41":8.3,"42":5.8,"43":8,"44":6.5,"45":1,"46":3.5,"47":7.1,"48":6.6,"49":6.5,"50":3.5,"51":7.2,"52":7.1,"53":6.3,"54":6.7,"55":6.8,"56":8.5,"57":8,"58":8.8,"59":6.4},"deeltoets2":{"1":1,"2":1,"3":7,"4":5.4,"5":6.1,"6":4.7,"7":1,"8":5.5,"9":5.9,"10":7.1,"11":8,"12":8,"13":6.6,"14":5.1,"15":8.3,"16":4.5,"17":6.9,"18":9.1,"19":7.2,"20":7.5,"21":7,"22":8,"23":6.5,"24":5.5,"25":5.3,"26":6.5,"27":7.3,"28":8.2,"29":5.5,"30":1,"31":7.3,"32":6.5,"33":6.5,"34":5.8,"35":7.4,"36":6.8,"37":8.1,"38":6.6,"39":6,"40":1,"41":8.6,"42":5.1,"43":5.8,"44":4.9,"45":4.1,"46":4.7,"47":7.5,"48":5.3,"49":6.8,"50":1,"51":7.3,"52":7.5,"53":5.8,"54":6.6,"55":4.9,"56":8.9,"57":9.1,"58":7.8,"59":5},"deeltoets1":{"1":1,"2":6.3,"3":6.9,"4":7.5,"5":7.2,"6":1,"7":4.7,"8":9.4,"9":8.1,"10":9.4,"11":8.8,"12":6.6,"13":6.6,"14":7.5,"15":9.4,"16":6.6,"17":5.9,"18":8.1,"19":9.1,"20":7.5,"21":9.1,"22":10,"23":4.7,"24":7.8,"25":4.1,"26":7.5,"27":5.9,"28":9.4,"29":5.6,"30":9.7,"31":8.1,"32":5,"33":7.8,"34":7.2,"35":8.1,"36":7.2,"37":8.4,"38":8.4,"39":5.3,"40":6.3,"41":9.1,"42":9.4,"43":6.6,"44":9.1,"45":5.6,"46":4.7,"47":8.8,"48":7.2,"49":7.8,"50":7.5,"51":7.8,"52":9.7,"53":5.9,"54":7.2,"55":4.1,"56":8.4,"57":9.7,"58":9.7,"59":7.8}}') as GradesDatasets : {}
    finalGradesDatasetName = (this.enabled && this.mockFinalGradesDatasetName) ? "eindcijfer" : ""
}

  export class TrainModelMock extends Mock {
    mockModel = true;

    model: GradePredictionModel | null =
      (this.enabled && this.mockModel)
        ? {
            "intercept": 0,
            "parameters": [
              {
                "parameterID": 2,
                "weight": -0.20628158982515943,
              },
              {
                "parameterID": 4,
                "weight": 0.5987301721162606,
              },
              {
                "parameterID": 7,
                "weight": 0.7351437498019004,
              },
              {
                "parameterID": 1,
                "weight": -0.05163026454991204,
              },
            ],
          }
        : null;

    modelWithMetadata =
      (this.enabled && this.mockModel)
        ? {
            "model": {
              "name": "multivariateLinearRegression",
              "weights": [
                [-0.20628158982515943],
                [0.5987301721162606],
                [0.7351437498019004],
                [-0.05163026454991204],
              ],
              "inputs": 4,
              "outputs": 1,
              "intercept": false,
              "summary": {
                "regressionStatistics": {
                  "standardError": 0.9270044844591805,
                  "observations": 1,
                },
                "variables": [
                  {
                    "label": "X Variable 1",
                    "coefficients": [-0.20628158982515943],
                    "standardError": 0.08731014539207609,
                    "tStat": -2.3626302407220674,
                  },
                  {
                    "label": "X Variable 2",
                    "coefficients": [0.5987301721162606],
                    "standardError": 0.12416150926563964,
                    "tStat": 4.822188258321637,
                  },
                  {
                    "label": "X Variable 3",
                    "coefficients": [0.7351437498019004],
                    "standardError": 0.07154733424292914,
                    "tStat": 10.274928585121298,
                  },
                  {
                    "label": "Intercept",
                    "coefficients": [-0.05163026454991204],
                    "standardError": 0.06950154171021325,
                    "tStat": -0.7428650254289967,
                  },
                ],
              },
            },
            "modelColumns": [2, 4, 7, 1],
          }
        : null;
  }

export class ModelConfiguratorMock extends Mock {
    mockCurrentStep = true;

    currentStep = this.enabled && this.mockCurrentStep ? 1 : 1;

    gradesDatasets = new UploadDataMock(this.enabled).gradesDatasets;
    finalGradesDatasetName = new UploadDataMock(this.enabled)
      .finalGradesDatasetName;
    gradesDatasetTilePairs = new LinkLiveDataMock(this.enabled)
      .gradesDatasetTilePairs;
    model = new TrainModelMock(this.enabled).model;
  }
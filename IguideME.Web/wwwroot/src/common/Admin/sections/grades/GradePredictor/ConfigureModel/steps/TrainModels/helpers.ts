import {RelationshipRegistry} from "../../../../../../../../models/app/GradePredictor";
import MLR from "ml-regression-multivariate-linear";

const compute = require( 'compute.io' );

export const getRegistryCombinations = (registry: RelationshipRegistry[]): RelationshipRegistry[][] => {

  let results = [];
  const n = registry.length;

  for (let r = 3; r <= n; r ++) {
    let a: number[] = [];

    for (let i = 0; i < r; i++) {
      a[i] = i;
    }

    let i = r - 1;
    while (a[0] < n - r + 1) {
      while (i > 0 && a[i] == n - r + i) i--;

      results.push(JSON.parse(JSON.stringify(a.map(idx => registry[idx]))));
      a[i]++;

      while (i < r - 1) {
        a[i + 1] = a[i] + 1;
        i++;
      }
    }
  }

  return results;
}

export const splitData = (data: number[][], testSize: number = 0.2) => {
  const X: any[] = data.map(r => r.slice(0, r.length - 1));
  const X_t = X;
  const y = data.map(r => r[r.length - 1]);
  //console.log(data, X, data.map(r => r[r.length - 1]));
  const splitIdx = Math.round((1 - testSize) * data.length);
  const xTest = X_t.slice(splitIdx, data.length);
  const xTrain = X_t.slice(0, splitIdx);
  const yTest = y.slice(splitIdx, data.length);
  const yTrain = y.slice(0, splitIdx);
  return [xTrain, xTest, yTrain, yTest]
}

export const trainLinearModel = async ( xTrain: number[][],
                                        yTrain: number[],
                                        xTest: number[][],
                                        yTest: number[]): Promise<{ model: MLR, mse: number }> => {
  const model = new MLR(xTrain, yTrain.map(x => [x]));

  let errors: number[] = [];
  xTest.forEach((x, i) => {
    errors.push(Math.pow(model.predict(x)[0] - yTest[i], 2));
  })

  // compute Mean Square Error
  const mse = Math.round(compute.mean(errors) * 1000) / 1000;
  return Promise.resolve({ model, mse });
}


export const createCollectionKey = (registry: RelationshipRegistry[]) => {
  const key = registry.map(r => {
    if (r.entry_id > 0) {
      return `${r.tile_id}-${r.entry_id}`;
    }

    return r.tile_id;
  }).sort();

  return key.join('#');
}
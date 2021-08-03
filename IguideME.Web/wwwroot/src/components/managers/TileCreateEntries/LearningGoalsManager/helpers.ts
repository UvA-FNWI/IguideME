export const generateUniqueID = (ids: number[]) => {

  let id = Math.floor((Math.random() * 1000000) + 1);

  while (ids.includes(id)) {
    id = Math.floor((Math.random() * 1000000) + 1);
  }

  return id;
}
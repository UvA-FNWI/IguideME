export const validateExternalUploadSchema = (records: any[]) => {
  return records.every(row => {
    const rowKeys = Object.keys(row).map(s => s.toLowerCase());
    return ['studentloginid', 'grade'].every(k => rowKeys.includes(k));
  });
}

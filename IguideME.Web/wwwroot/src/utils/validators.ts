export const validateExternalUploadSchema = (records: any[]) => {
  return records.every(row => {
    const rowKeys = Object.keys(row).map(s => s.toLowerCase());
    return ['final_grade'].every(k => rowKeys.includes(k));
  });
}
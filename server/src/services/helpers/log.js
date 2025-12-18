
export const ActivityLogHelper = {
  validateJson: function(metaData) {
    try {
      JSON.stringify(metaData);
      return true;
    } catch (error) {
      return false
    }
  }
}
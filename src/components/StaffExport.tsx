import axios from 'axios';

export const downloadExcelFile = async (showAlert: (type: string, title: string, message: string) => void) => {
  try {
    console.log('Starting download...');

    const response = await axios.get("api/staff/export", {
      responseType: 'blob'
    });

    console.log('Response Headers:', response.headers);

    // Get filename from Content-Disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'export.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    console.log('Filename:', filename);

    // Create a blob URL
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    });
    const url = window.URL.createObjectURL(blob);

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('Download triggered successfully');
    showAlert('success', 'Export Success', 'File exported successfully.');
  } catch (error) {
    console.error('Export Error:', error);
    showAlert('error', 'Export Failed', 'Failed to export the file. Please try again.');
  }
};
import * as XLSX from 'xlsx';

export default function DownloadTransactions({ data }) {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'transactions.xlsx');
  };

  return (
    <button
      type="button"
      onClick={exportToExcel}
      title="Download statement as Excel"
      className="btn-ghost ml-3 whitespace-nowrap"
    >
      <i className="fas fa-file-download text-xs"></i> Statement
    </button>
  );
}

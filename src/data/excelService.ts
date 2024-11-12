import * as xlsx from "xlsx";

export class ExcelService {
  static readExcel(sheetName: string): any[] {
    const workbook = xlsx.readFile("test_data.xlsx");
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
  }

  static writeExcel(sheetName: string, data: any[]): void {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
    xlsx.writeFile(workbook, `${sheetName}_results.xlsx`);
  }
}

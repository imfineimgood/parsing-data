import { useState } from "react";
import { read, utils } from "xlsx";

export default function useExcel() {
  const [parsedData, setParsedData] = useState([]);
  const parsingExcel = (event) => {
    const input = event.target.files;
    const reader = new FileReader();
    reader.onload = function () {
      const fdata = reader.result;
      const read_buffer = read(fdata, { type: "binary" });
      read_buffer.SheetNames.forEach(function (sheetName) {
        const rowdata = utils.sheet_to_json(read_buffer.Sheets[sheetName]);
        setParsedData(rowdata);
      });
    };
    reader.readAsBinaryString(input[0]);
  };

  return { parsedData, parsingExcel };
}

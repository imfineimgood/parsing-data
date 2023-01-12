import "./App.css";
import React, { useState } from "react";
import { read, utils } from "xlsx";

function App() {
  const [data, setData] = useState();
  function uploadExcel(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
      var fdata = reader.result;
      var read_buffer = read(fdata, { type: "binary" });
      read_buffer.SheetNames.forEach(function (sheetName) {
        var rowdata = utils.sheet_to_json(read_buffer.Sheets[sheetName]);
        console.log(JSON.stringify(rowdata));
        setData(JSON.stringify(rowdata));
      });
    };
    reader.readAsBinaryString(input.files[0]);
  }

  return (
    <>
      <div>
        <input type="file" onChange={uploadExcel} />
      </div>
      <div>{data}</div>
    </>
  );
}

export default App;

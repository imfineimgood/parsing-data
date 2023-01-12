import React, { useState } from "react";
import { read, utils } from "xlsx";

function App() {
  const [data, setData] = useState([]);
  function uploadExcel(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
      var fdata = reader.result;
      var read_buffer = read(fdata, { type: "binary" });
      read_buffer.SheetNames.forEach(function (sheetName) {
        var rowdata = utils.sheet_to_json(read_buffer.Sheets[sheetName]);
        console.log(rowdata);
        setData(rowdata);
      });
    };
    reader.readAsBinaryString(input.files[0]);
  }

  return (
    <>
      <input type="file" onChange={uploadExcel} />

      <table>
        <tr>
          <th>이름</th>
          <th>나이</th>
          <th>성별</th>
        </tr>

        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.first_name}</td>
            <td>{item.gender}</td>
            <td>{item.email}</td>
          </tr>
        ))}
      </table>
    </>
  );
}

export default App;

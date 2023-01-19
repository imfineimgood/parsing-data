import React, { useState } from "react";
import { read, utils } from "xlsx";

function Data() {
  const [data, setData] = useState([]);
  function uploadExcel(event) {
    let input = event.target.files;
    let reader = new FileReader();
    reader.onload = function () {
      let fdata = reader.result;
      let read_buffer = read(fdata, { type: "binary" });
      read_buffer.SheetNames.forEach(function (sheetName) {
        let rowdata = utils.sheet_to_json(read_buffer.Sheets[sheetName]);
        const newData = rowdata.map((v) => ({
          id: v.동물번호 ? v.동물번호 : v.환자ID,
          petName: v.환자 ? v.환자 : v.동물명,
          name: v.고객명 ? v.고객명 : v.보호자,
          species: v.품종,
          type:
            v.종.toLowerCase() === "canine"
              ? "수컷"
              : v.종.toLowerCase() === "feline"
              ? "암컷"
              : "etc",
          phone_number: v.핸드폰 ? v.핸드폰 : v.Mobile ? v.Mobile : v.전화,
        }));
        const map = new Map();
        newData.forEach((data) => {
          map.set(data.id, data);
        });
        const result = [...map.values()];
        setData(result);
        const [validData, invalidData] = validateData(result);
        console.log(validData);
        console.log(invalidData);
        const resultData = [...validData, ...invalidData].sort(
          (a, b) => a.id - b.id
        );
        setData(resultData);
      });
    };
    reader.readAsBinaryString(input[0]);
  }

  function validateData(data) {
    const validData = [];
    const invalidData = [];
    data.forEach((item) => {
      if (
        !(
          item.id &&
          item.petName &&
          item.name &&
          item.species &&
          item.type &&
          item.phone_number
        )
      ) {
        invalidData.push({ ...item, errorType: "invalid element" });
      } else {
        if (/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(item.phone_number)) {
          validData.push(item);
        } else if (item.phone_number.length !== 9 || 10 || 11) {
          invalidData.push({ ...item, errorType: "invalid phone number" });
        } else {
          const value = item.phone_number.replace(/[^0-9]/g, "");
          const firstLength = value.length > 9 ? 3 : 2;
          const validPhone = [
            value.slice(0, firstLength),
            value.slice(firstLength, value.length - 4),
            value.slice(value.length - 4),
          ].join("-");
          validData.push({ ...item, phone_number: validPhone });
        }
      }
    });
    return [validData, invalidData];
  }

  return (
    <>
      <input type="file" onChange={uploadExcel} />
      <table>
        <thead>
          <tr>
            <th>동물이름</th>
            <th>보호자</th>
            <th>휴대폰번호</th>
            <th>동물품종</th>
            <th>동물종</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <>
              <tr key={item.id}>
                <td>{item.petName}</td>
                <td>{item.name}</td>
                <td>{item.phone_number}</td>
                <td>{item.species}</td>
                <td>{item.type}</td>
                <td>
                  {item.errorType === "invalid phone number"
                    ? "전화번호를 확인해주세요"
                    : item.errorType === "invalid element"
                    ? "빈 항목이 존재합니다"
                    : null}
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Data;

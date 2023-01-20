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
          phone_number: v.핸드폰
            ? v.핸드폰.toString()
            : v.Mobile
            ? v.Mobile.toString()
            : v.전화
            ? v.전화.toString()
            : null,
        }));
        const map = new Map();
        newData.forEach((data) => {
          map.set(data.id, data);
        });
        const result = [...map.values()];
        setData(result);
        const [validData, invalidData] = validateData(result);
        const resultData = [...validData, ...invalidData];
        console.log(validData);
        console.log(invalidData);
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
        const value = item.phone_number.replace(/-/g, "");
        if (value.length === 9 || value.length === 10 || value.length === 11) {
          const firstLength = value.length > 9 ? 3 : 2;
          const validPhone = [
            value.slice(0, firstLength),
            value.slice(firstLength, value.length - 4),
            value.slice(value.length - 4),
          ].join("-");
          if (/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}/.test(validPhone)) {
            validData.push({ ...item, phone_number: validPhone });
          } else {
            invalidData.push({ ...item, errorType: "invalid phone number" });
          }
        } else {
          invalidData.push({ ...item, errorType: "invalid phone number" });
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
            <tr key={item.id}>
              <td>{item.petName}</td>
              <td>{item.name}</td>
              <td>{item.phone_number}</td>
              <td>{item.species}</td>
              <td>{item.type}</td>
              <td>
                {item.errorType === "invalid element"
                  ? "빈 항목이 존재합니다"
                  : item.errorType === "invalid phone number"
                  ? "전화번호를 확인해주세요"
                  : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Data;
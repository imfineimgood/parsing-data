import React, { useCallback, useMemo, useState } from "react";
import { read, utils } from "xlsx";
import DataList from "./DataList";

const Data = () => {
  const [data, setData] = useState([]);

  const validData = [];
  const invalidData = [];
  const regphone = /^0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4}/;

  function uploadExcel(event) {
    let input = event.target.files;
    let reader = new FileReader();
    reader.onload = function () {
      let fdata = reader.result;
      let read_buffer = read(fdata, { type: "binary" });
      read_buffer.SheetNames.forEach(function (sheetName) {
        let rowdata = utils.sheet_to_json(read_buffer.Sheets[sheetName]);
        const newData = setDefaultData(rowdata);
        const result = checkDuplicate(newData);
        const [validData, invalidData] = validateData(result);
        checkError(invalidData);
        const resultData = [...validData, ...invalidData];
        console.log(validData);
        console.log(invalidData);
        setData(resultData);
        console.log(resultData);
      });
    };
    reader.readAsBinaryString(input[0]);
  }

  const validateData = (data) => {
    const validData = data.filter((item) => {
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
        return false;
      } else {
        const value = item.phone_number.replace(/-/g, "");
        if (value.length === 9 || value.length === 10 || value.length === 11) {
          const firstLength = value.length > 9 ? 3 : 2;
          const validPhone = [
            value.slice(0, firstLength),
            value.slice(firstLength, value.length - 4),
            value.slice(value.length - 4),
          ].join("-");
          if (regphone.test(validPhone)) {
            item.phone_number = validPhone;
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    });
    const invalidData = data.filter((item) => !validData.includes(item));
    return [validData, invalidData];
  };

  const setDefaultData = (data) => {
    const newData = data.map((v) => ({
      id: v.동물번호 ? v.동물번호 : v.환자ID,
      petName: v.환자 ? v.환자 : v.동물명,
      name: v.고객명 ? v.고객명 : v.보호자,
      species: v.품종,
      type: v.종,
      phone_number: v.핸드폰 ? v.핸드폰 : v.Mobile ? v.Mobile : v.전화,
      errorType: [],
    }));
    return newData;
  };

  const checkDuplicate = (data) => {
    const map = new Map();
    data.forEach((data) => {
      map.set(data.id, data);
    });
    const result = [...map.values()];
    return result;
  };

  const checkError = (data) => {
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (item[key] === undefined) {
          item.errorType.push(key);
        }
      });
      if (
        item.phone_number !== undefined &&
        !regphone.test(item.phone_number)
      ) {
        item.errorType.push("phone_number");
      }
    });
  };

  const memoData = useMemo(() => validateData, [DataList]);
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
            <DataList {...item} key={item.id} setData={setData}></DataList>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Data;

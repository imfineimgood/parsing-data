import React, { useState } from "react";
import { read, utils } from "xlsx";
import DataList from "./DataList";

const Data = () => {
  const [data, setData] = useState([]);
  const [reData, setReData] = useState([]);

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
        setData(resultData);
      });
    };
    reader.readAsBinaryString(input[0]);
  }

  const validatePhoneNumber = (phoneNumber) => {
    const value = phoneNumber.replace(/-/g, "");
    if (!(value.length === 9 || value.length === 10 || value.length === 11)) {
      return false;
    }

    const firstLength = value.length > 9 ? 3 : 2;
    const validPhone = [
      value.slice(0, firstLength),
      value.slice(firstLength, value.length - 4),
      value.slice(value.length - 4),
    ].join("-");
    if (!regphone.test(validPhone)) {
      return false;
    }

    return validPhone;
  };

  const validateItem = (item) => {
    if (
      !item.id ||
      !item.petName ||
      !item.name ||
      !item.species ||
      !item.type ||
      !item.phone_number
    ) {
      return false;
    }

    const phoneNumber = validatePhoneNumber(item.phone_number);
    if (!phoneNumber) {
      return false;
    }

    item.phone_number = phoneNumber;
    return true;
  };

  const validateData = (data) => {
    const validData = data.filter(validateItem);
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

  const checkPhoneNumber = (item) => {
    if (!regphone.test(item.phone_number)) {
      item.errorType.push("phone_number");
    } else {
      const index = item.errorType.findIndex((element) => {
        return element === "phone_number";
      });
      if (index !== -1) {
        item.errorType.splice(index, 1);
      }
    }
  };

  const checkProperties = (item) => {
    Object.keys(item).forEach((key) => {
      if (item[key] === undefined) {
        item.errorType.push(key);
      } else {
        if (key === "phone_number") {
          checkPhoneNumber(item);
        } else {
          const index = item.errorType.findIndex((element) => {
            return element === key;
          });
          if (index !== -1) {
            item.errorType.splice(index, 1);
          }
        }
      }
    });
  };

  const checkError = (data) => {
    data.forEach((item) => {
      checkProperties(item);
      checkPhoneNumber(item);
    });
  };

  const onItemChange = (changedItem) => {
    const refreshedData = data.map((item) => {
      if (changedItem.id === item.id) {
        return changedItem;
      } else {
        return item;
      }
    });
    checkError(refreshedData);
    setData(refreshedData);
    console.log(data);
  };

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
            <DataList
              item={item}
              key={item.id}
              onValidate={validateItem}
              onItemChange={onItemChange}
            ></DataList>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Data;

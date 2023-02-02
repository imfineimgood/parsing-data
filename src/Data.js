import React, { useState } from "react";
import DataList from "./DataList";
import useExcel from "./useExcel";

const regphone = /^0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4}/;

const Data = () => {
  const [data, setData] = useState([]);
  const [infoData, setInfoData] = useState({});

  const handleData = (data) => {
    const convertedData = convertData(data);
    const checkedData = checkDuplicate(convertedData);
    const sortedData = sortData(checkedData);
    setData(sortedData);
  };

  const parsingExcel = useExcel(handleData);

  const convertData = (data) => {
    return data
      .map((v) => ({
        id: v.동물번호 ? v.동물번호 : v.환자ID,
        petName: v.환자 ? v.환자 : v.동물명,
        name: v.고객명 ? v.고객명 : v.보호자,
        species: v.품종,
        type: v.종,
        phone_number: v.핸드폰 ? v.핸드폰 : v.Mobile ? v.Mobile : v.전화,
        errorType: [],
      }))
      .map((item) => ({
        ...item,
        type:
          item.type &&
          (item.type.toLowerCase() === "feline"
            ? "고양이"
            : item.type.toLowerCase() === "canine"
            ? "개"
            : "기타"),
      }));
  };

  const checkDuplicate = (data) => {
    const map = new Map();
    data.forEach((data) => {
      map.set(data.id, data);
    });
    const result = [...map.values()];
    return result;
  };

  const sortData = (data) => {
    const [validData, invalidData] = validateData(data);
    return [...validData, ...invalidData];
  };

  const formatPhoneNumber = (value) => {
    const firstLength = value.length > 9 ? 3 : 2;
    return [
      value.slice(0, firstLength),
      value.slice(firstLength, value.length - 4),
      value.slice(value.length - 4),
    ].join("-");
  };

  const validatePhoneNumber = (phoneNumber) => {
    const value = phoneNumber.replace(/-/g, "");
    if (!(value.length === 9 || value.length === 10 || value.length === 11)) {
      return false;
    }

    const validPhone = formatPhoneNumber(value);

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
    checkError(invalidData);
    return [validData, invalidData];
  };

  const handleClick = (data) => {
    const [validData, invalidData] = validateData(data);
    setData([...validData, ...invalidData]);

    if (data.length !== 0 && invalidData.length === 0) {
      transformData();
    }
  };

  const removeErrorType = (item, key) => {
    const index = item.errorType.findIndex((element) => {
      return element === key;
    });
    if (index !== -1) {
      item.errorType.splice(index, 1);
    }
  };

  const checkPhoneNumber = (item) => {
    if (!regphone.test(item.phone_number)) {
      if (item.errorType.indexOf("phone_number") === -1) {
        item.errorType.push("phone_number");
      }
    } else {
      removeErrorType(item, "phone_number");
    }
  };

  const checkType = (item) => {
    if (item.type === "개" || item.type === "고양이" || item.type === "기타") {
      removeErrorType(item, "type");
    }
  };

  const checkProperties = (item) => {
    Object.keys(item).forEach((key) => {
      if (!item[key]) {
        if (item.errorType.indexOf(key) === -1) {
          item.errorType.push(key);
        }
      } else {
        if (key === "phone_number") {
          checkPhoneNumber(item);
        } else if (key === "type") {
          checkType(item);
        } else {
          removeErrorType(item, key);
        }
      }
    });
  };

  const checkError = (data) => {
    data.forEach((item) => {
      checkProperties(item);
    });
  };

  const onItemChange = (changedItem) => {
    const refreshedData = data.map((item) => {
      if (changedItem.id === item.id) {
        checkError([changedItem]);
        return changedItem;
      } else {
        return item;
      }
    });
    setData(refreshedData);
  };

  const transformData = () => {
    const transformedData = data.map((item) => ({
      familyInfo: {
        name: item.name,
        phoneNumber: item.phone_number,
      },
      petInfo: {
        name: item.petName,
        type: item.type === "개" ? 0 : item.type === "고양이" ? 1 : 2,
        species: item.species,
      },
    }));
    setInfoData(transformedData);
    console.log("!");
  };

  return (
    <>
      <input type="file" onChange={parsingExcel} />
      <table style={{ width: "95%", margin: "auto" }}>
        <thead
          style={{
            height: "45px",
          }}
        >
          <tr>
            {TITLE_MAP.map((item, i) => (
              <th key={i}>{item}</th>
            ))}
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
      <button
        style={{
          width: "90px",
          height: "30px",
          backgroundColor: "#7d3fff",
          color: "white",
          border: "none",
        }}
        onClick={() => {
          handleClick(data);
        }}
      >
        완료
      </button>
    </>
  );
};

export default Data;

const TITLE_MAP = ["동물이름", "보호자", "휴대폰번호", "동물품종", "동물종"];

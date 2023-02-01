import React, { useState } from "react";
import { read, utils } from "xlsx";
import DataList from "./DataList";

const Data = () => {
  const [data, setData] = useState([]);
  const [infoData, setInfoData] = useState({});
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
        setType(newData);
        const result = checkDuplicate(newData);
        sortData(result, false);
      });
    };
    reader.readAsBinaryString(input[0]);
  }

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

  const setType = (data) => {
    data.forEach((item) => {
      if (item.type) {
        item.type =
          item.type.toLowerCase() === "feline"
            ? "고양이"
            : item.type.toLowerCase() === "canine"
            ? "개"
            : "etc";
        return item.type;
      }
    });
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
      if (item.errorType.indexOf("phone_number") === -1) {
        item.errorType.push("phone_number");
      }
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
      if (!item[key]) {
        if (item.errorType.indexOf(key) === -1) {
          item.errorType.push(key);
        }
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

  const sortData = (data, isClicked) => {
    const [validData, invalidData] = validateData(data);
    checkError(invalidData);
    setData([...validData, ...invalidData]);

    if (isClicked && data.length !== 0 && invalidData.length === 0) {
      transformData();
    }
  };

  const transformData = () => {
    const transformedData = data.map((item) => ({
      familyInfo: {
        name: item.name,
        phoneNumber: item.phone_number,
      },
      petInfo: {
        name: item.petName,
        type: item.type,
        species: item.species,
      },
    }));
    setInfoData(transformedData);
    console.log("complete");
  };

  return (
    <>
      <input type="file" onChange={uploadExcel} />
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
          sortData(data, true);
        }}
      >
        완료
      </button>
    </>
  );
};

export default Data;

const TITLE_MAP = ["동물이름", "보호자", "휴대폰번호", "동물품종", "동물종"];

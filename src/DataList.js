import React, { useState } from "react";

const DataList = ({ item, onValidate, onItemChange }) => {
  const [dataValue, setDataValue] = useState({
    id: item.id,
    petName: item.petName,
    name: item.name,
    species: item.species,
    type: item.type,
    phone_number: item.phone_number,
    errorType: item.errorType,
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    let formatPhoneValue = value;
    if (!onValidate) {
      throw Error("유효하지 않음");
    } else {
      if (name === "phone_number") {
        formatPhoneValue = value
          .replace(/[^0-9]/g, "")
          .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
      }
      const changedItem = {
        ...dataValue,
        [name]: formatPhoneValue,
        valid: onValidate(dataValue),
      };
      setDataValue(changedItem);
      onItemChange && onItemChange(changedItem);
    }
    console.log(dataValue);
  };

  return (
    <>
      <tr>
        <td>
          <>
            <input
              type="text"
              name="petName"
              value={dataValue.petName}
              onChange={handleForm}
            />
            {item.errorType.includes("petName") ? (
              <div style={{ color: "red", fontSize: "5px" }}>확인해주세요</div>
            ) : null}
          </>
        </td>
        <td>
          <>
            <input
              type="text"
              name="name"
              value={dataValue.name}
              onChange={handleForm}
            />
            {item.errorType.includes("name") ? (
              <div style={{ color: "red", fontSize: "5px" }}>확인해주세요</div>
            ) : null}
          </>
        </td>
        <td>
          <>
            <input
              type="text"
              name="phone_number"
              value={dataValue.phone_number}
              onChange={handleForm}
            />
            {item.errorType.includes("phone_number") ? (
              <div style={{ color: "red", fontSize: "5px" }}>확인해주세요</div>
            ) : null}
          </>
        </td>
        <td>
          <>
            <input
              type="text"
              name="species"
              value={dataValue.species}
              onChange={handleForm}
            />
            {item.errorType.includes("species") ? (
              <div style={{ color: "red", fontSize: "5px" }}>확인해주세요</div>
            ) : null}
          </>
        </td>
        <td>
          <>
            <input
              type="text"
              name="type"
              value={dataValue.type}
              onChange={handleForm}
            />
            {item.errorType.includes("type") ? (
              <div style={{ color: "red", fontSize: "5px" }}>확인해주세요</div>
            ) : null}
          </>
        </td>
      </tr>
    </>
  );
};

export default DataList;

const INPUT_MAP = ["petName", "name", "phone_number", "species", "type"];

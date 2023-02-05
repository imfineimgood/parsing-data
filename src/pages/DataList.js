import React, { useState } from "react";

const DataList = ({ item, onValidate, onItemChange }) => {
  const regphone = /^0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4}/;
  const [dataValue, setDataValue] = useState({
    id: item.id,
    petName: item.petName,
    name: item.name,
    species: item.species,
    type: item.type,
    phone_number: item.phone_number,
    errorType: item.errorType,
  });

  const formatPhone = (value) => {
    return value
      .replace(/-/g, "")
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    let formatPhoneValue = value;
    if (!onValidate) {
      throw Error("유효하지 않음");
    } else {
      if (name === "phone_number") {
        formatPhoneValue = formatPhone(value);
      }
      const changedItem = {
        ...dataValue,
        [name]: formatPhoneValue,
      };
      setDataValue(changedItem);
      onItemChange && onItemChange(changedItem);
    }
  };

  return (
    <>
      <tr>
        {INPUT_MAP.map((element) => (
          <td
            key={element}
            style={{
              height: "50px",
              borderStyle: "double",
              borderColor: "#7d3fff",
            }}
          >
            <input
              type="text"
              name={element}
              value={dataValue[element] || ""}
              onChange={handleForm}
              style={{
                height: "30px",
                border: "none",
                fontSize: "15px",
                backgroundColor: "transparent",
              }}
            />
            {item.errorType.includes(element) ? (
              <div style={{ color: "red", fontSize: "5px" }}>확인해주세요</div>
            ) : null}
          </td>
        ))}
      </tr>
    </>
  );
};

export default DataList;

const INPUT_MAP = ["petName", "name", "phone_number", "species", "type"];

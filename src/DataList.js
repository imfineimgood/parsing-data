import React, { useState } from "react";

const DataList = (item, memoData, setData) => {
  const regphone = /^0[0-9]{1,2}-[0-9]{3,4}-[0-9]{4}/;

  const [dataValue, setDataValue] = useState({
    id: item.id,
    petName: item.petName,
    name: item.name,
    species: item.species,
    type: item.type,
    phone_number: item.phone_number,
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setDataValue({ ...dataValue, [name]: value });
  };

  const onClick = () => {};

  const isPetNameValid = dataValue.petName !== undefined;
  const isNameValid = dataValue.name !== undefined;
  const isSpeciesValid = dataValue.species !== undefined;
  const isPhoneNumberValid = regphone.test(dataValue.phone_number);
  const isTypeValid =
    (dataValue.type === "개") |
    (dataValue.type === "고양이") |
    (dataValue.type === "기타");

  const isAllValid =
    isPetNameValid &&
    isNameValid &&
    isSpeciesValid &&
    isPhoneNumberValid &&
    isTypeValid;

  return (
    <>
      <tr>
        <td>
          {item.errorType.includes("petName") ? (
            <>
              <input
                type="text"
                name="petName"
                value={dataValue.petName}
                onChange={handleForm}
              />
              {!isPetNameValid ? (
                <div style={{ color: "red", fontSize: "5px" }}>
                  확인해주세요
                </div>
              ) : null}
            </>
          ) : (
            item.petName
          )}
        </td>
        <td>
          {item.errorType.includes("name") ? (
            <>
              <input
                type="text"
                name="name"
                value={dataValue.name}
                onChange={handleForm}
              />{" "}
              {!isNameValid ? (
                <div style={{ color: "red", fontSize: "5px" }}>
                  확인해주세요
                </div>
              ) : null}
            </>
          ) : (
            item.name
          )}
        </td>
        <td>
          {item.errorType.includes("phone_number") ? (
            <>
              <input
                type="text"
                name="phone_number"
                value={dataValue.phone_number}
                onChange={handleForm}
              />{" "}
              {!isPhoneNumberValid ? (
                <div style={{ color: "red", fontSize: "5px" }}>
                  확인해주세요
                </div>
              ) : null}
            </>
          ) : (
            item.phone_number
          )}
        </td>
        <td>
          {item.errorType.includes("species") ? (
            <>
              <input
                type="text"
                name="species"
                value={dataValue.species}
                onChange={handleForm}
              />{" "}
              {!isSpeciesValid ? (
                <div style={{ color: "red", fontSize: "5px" }}>
                  확인해주세요
                </div>
              ) : null}
            </>
          ) : (
            item.species
          )}
        </td>
        <td>
          {item.errorType.includes("type") ? (
            <>
              <input
                type="text"
                name="type"
                value={dataValue.type}
                onChange={handleForm}
              />{" "}
              {!isTypeValid ? (
                <div style={{ color: "red", fontSize: "5px" }}>
                  확인해주세요
                </div>
              ) : null}
            </>
          ) : (
            item.type
          )}
        </td>
        {isAllValid ? (
          <td>
            <button onClick={onClick}>수정</button>
          </td>
        ) : null}
      </tr>
    </>
  );
};

export default DataList;

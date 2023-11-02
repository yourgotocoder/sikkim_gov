import React, { useEffect, useState } from "react";
import styles from "./EditDistricts.module.css";
import { districtsTable } from "../database.config";
import { IDistrict } from "../types";
import { useLiveQuery } from "dexie-react-hooks";

export const EditDistricts = () => {
  const [district, setDistrict] = useState("");

  const districtTableData = useLiveQuery(() => districtsTable.toArray(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const districtName = district.trim().toLowerCase();
    const districtData: IDistrict = { name: districtName };
    try {
      const exists = await districtsTable
        .where("name")
        .equals(districtName)
        .toArray();
      if (exists.length > 0) {
        alert("District already exists");
        return;
      }
      const id = await districtsTable.add(districtData);
      console.log(id);
      setDistrict("");
    } catch (error) { }
  };

  const handleDelete = async (id) => {
    const deleted = await districtsTable.delete(id);
  };

  return (
    <div className={styles.district}>
      <div className={styles.formArea}>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.districtInput}
            placeholder="Add District Here"
            onChange={(e) => setDistrict(e.target.value)}
            value={district}
          />
          <button className={styles.districtButton}>Add District</button>
        </form>
      </div>
      <div className={styles.tableArea}>
        <h3>
          Total Districts: {districtTableData && districtTableData.length}
        </h3>
        <table border={1}>
          <thead>
            <tr>
              <th>District</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {districtTableData &&
              districtTableData.map((district) => (
                <tr key={district.name}>
                  <td className={styles.minWidth}>
                    {district.name.toUpperCase()}
                  </td>
                  <td className={styles.tdItem}>
                    <button
                      className={styles.districtButtonDelete}
                      onClick={async () => await handleDelete(district.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

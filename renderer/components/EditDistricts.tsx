import React, { useEffect, useState } from "react";
import styles from "./EditDistricts.module.css";
import { districtsTable } from "../database.config";
import { IDistrict } from "../types";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, TextField } from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForever";

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
          <TextField
            className={styles.districtInput}
            label="Add District Here"
            onChange={(e) => setDistrict(e.target.value)}
            value={district}
            variant="filled"
          />
          <Button variant="outlined" sx={{ marginLeft: 2, marginTop: 1 }}>
            Add District
          </Button>
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
                    <Button
                      onClick={async () => await handleDelete(district.id)}
                    >
                      <DeleteForever />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import styles from "./EditSubject.module.css";
import { subjectsTable } from "../database.config";
import { ISubject } from "../types";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, TextField } from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForever";

const EditSubjects = () => {
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const subjectsTableData = useLiveQuery(() => subjectsTable.toArray(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectTitle || !subjectCode) return;
    const subjectCodeVerified = subjectCode.trim().toLowerCase();
    const subjectData: ISubject = {
      title: subjectTitle,
      code: subjectCodeVerified,
    };
    try {
      const exists = await subjectsTable
        .where("code")
        .equals(subjectCodeVerified)
        .toArray();
      if (exists.length > 0) {
        alert("Subject Code already exists");
        return;
      }
      const existsSubject = await subjectsTable
        .where("title")
        .equals(subjectTitle)
        .toArray();
      if (existsSubject.length > 0) {
        alert("Subject Title already exists");
        return;
      }

      const id = await subjectsTable.add(subjectData);
      setSubjectTitle("");
      setSubjectCode("");
    } catch (error) { }
  };

  const handleDelete = async (id) => {
    const deleted = await subjectsTable.delete(id);
    console.log(deleted);
  };
  return (
    <div className={styles.subject}>
      <div className={styles.formArea}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <TextField
              label="Subject Title"
              placeholder="Add Subject Title Here"
              onChange={(e) => setSubjectTitle(e.target.value)}
              value={subjectTitle}
              sx={{ marginRight: 1 }}
              required
            />

            <TextField
              label="Subject Code"
              placeholder="Add Subject Code Here"
              onChange={(e) => setSubjectCode(e.target.value)}
              value={subjectCode}
              required
            />
          </div>
          <div className={styles.formSubmit}>
            <Button variant="contained" type="submit">
              Add Subject
            </Button>
          </div>
        </form>
      </div>
      <div className={styles.tableArea}>
        <table border={1}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjectsTableData &&
              subjectsTableData.map((subject) => (
                <tr key={subject.id}>
                  <td className={styles.tdItem}>{subject.title}</td>
                  <td className={styles.tdItem}>
                    {subject.code.toUpperCase()}
                  </td>
                  <td className={styles.tdItem}>
                    <Button
                      onClick={async () => await handleDelete(subject.id)}
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

export default EditSubjects;

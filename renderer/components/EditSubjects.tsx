import React, { useState } from "react";
import styles from "./EditSubject.module.css";
import { subjectsTable } from "../database.config";
import { ISubject } from "../types";
import { useLiveQuery } from "dexie-react-hooks";

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
    } catch (error) {}
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
            <label>
              Title:
              <input
                className={styles.subjectInput}
                placeholder="Add Subject Title Here"
                onChange={(e) => setSubjectTitle(e.target.value)}
                value={subjectTitle}
              />
            </label>
            <label>
              Code:
              <input
                className={styles.subjectInput}
                placeholder="Add Subject Code Here"
                onChange={(e) => setSubjectCode(e.target.value)}
                value={subjectCode}
              />
            </label>
          </div>
          <div className={styles.formSubmit}>
            <button className={styles.subjectButton}>Add Subject</button>
          </div>
        </form>
      </div>
      <div className={styles.tableArea}>
        <table border={1}>
          <tr>
            <th>Subject</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
          {subjectsTableData &&
            subjectsTableData.map((subject) => (
              <tr>
                <td>{subject.title}</td>
                <td>{subject.code.toUpperCase()}</td>
                <td>
                  <button
                    className={styles.districtButtonDelete}
                    onClick={async () => await handleDelete(subject.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
};

export default EditSubjects;

import React, { useEffect, useState } from "react";
import Select from "react-select";
import styles from "./ManageSchools.module.css";
import { IDistrict, ISchool, ISubject } from "../types";
import {
  districtsTable,
  subjectsTable,
  schoolsTable,
} from "../database.config";
import { useLiveQuery } from "dexie-react-hooks";

const ManageSchools = () => {
  const [addingSchool, setAddingSchool] = useState<boolean>(false);
  const [schoolName, setSchoolName] = useState<string>("");
  const [schoolCode, setSchoolCode] = useState<string>("");
  const [schoolContact, setSchoolContact] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isViewing, setIsViewingSchool] = useState<boolean>(false);
  const [viewingSchoolData, setViewingSchoolData] = useState<ISchool>();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schoolName) {
      alert("Please enter school name");
      return;
    }
    if (!schoolCode) {
      alert("Please enter school code");
      return;
    }
    if (!district) {
      alert("Please select a district");
      return;
    }
    if (subjects.length === 0) {
      alert("Please select at least one subject");
      return;
    }
    if (!schoolContact) {
      alert("Please enter school contact number");
      return;
    }

    const schoolCodeVerified = schoolCode.trim().toLowerCase();
    const schoolNameVerified = schoolName.trim().toLowerCase();

    await schoolsTable.add({
      name: schoolNameVerified,
      code: schoolCodeVerified,
      district: district,
      contactno: schoolContact,
      subjects: subjects,
    });
    setAddingSchool(false);
    setSchoolName("");
    setSchoolCode("");
    setDistrict("");
    setSubjects([]);
    setSchoolContact("");
  };

  const viewSchool = (school: ISchool) => {
    setIsViewingSchool(true);
    setViewingSchoolData(school);
  };

  const handleViewCancel = () => {
    setIsViewingSchool(false);
    setViewingSchoolData(null);
  };
  const handleDelete = async (id) => {
    const deleted = await schoolsTable.delete(id);
  };

  const districtsTableData = useLiveQuery(() => districtsTable.toArray(), []);
  const subjectsTableData: ISubject[] = useLiveQuery(
    () => subjectsTable.toArray(),
    [],
  );
  const schoolsTableData: ISchool[] = useLiveQuery(
    () => schoolsTable.toArray(),
    [],
  );

  const [subjectsData, setSubjectsData] = useState([]);
  useEffect(() => {}, [subjectsTableData]);
  useEffect(() => {
    if (subjectsTableData) {
      const data = subjectsTableData.map((subjectValue) => ({
        value: subjectValue.code,
        label: subjectValue.title,
      }));
      setSubjectsData(data);
    }
  }, [subjectsTableData]);

  const handleDistrictSelect = (e) => {
    if (e.target.value === "none") {
      alert("Please select a district");
      setDistrict("");
    } else {
      setDistrict(e.target.value);
    }
  };

  const handleSubjectSelect = (e) => {
    setSubjects(e);
  };

  const handleGenerate = () => {
    console.log(schoolsTableData);
    const data = {
      district: districtsTableData,
      subject: subjectsTableData,
      school: schoolsTableData,
    };
    window.ipc.send("generate-pdf", data);
    window.ipc.on("generate-pdf", (reply: string) => {
      console.log(reply);
    });
  };

  return (
    <div className={styles.manageSchools}>
      <div className={styles.formArea}>
        {!addingSchool && !isViewing && (
          <div className={styles.actions}>
            <button
              onClick={() => setAddingSchool(!addingSchool)}
              className={styles.actionButton}
            >
              Add School
            </button>
            <button
              onClick={handleGenerate}
              className={`${styles["ml-2"]} ${styles["actionButton"]} ${styles["bg-blue"]}`}
            >
              Generate
            </button>
          </div>
        )}
        {addingSchool && !isViewing && (
          <div className={styles.form}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputBlock}>
                <label className={styles.inputArea}>
                  School Name:
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </label>
                <label className={styles.inputArea}>
                  School Code:
                  <input
                    type="text"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value)}
                  />
                </label>
              </div>
              <div className={styles.inputBlock}>
                <label className={styles.inputArea}>
                  Contact Number:
                  <input
                    type="number"
                    value={schoolContact}
                    onChange={(e) => setSchoolContact(e.target.value)}
                  />
                </label>
                <label className={styles.inputArea}>
                  District:
                  <select value={district} onChange={handleDistrictSelect}>
                    <option value="none">Select a district</option>

                    {districtsTableData &&
                      districtsTableData.map((district) => (
                        <option key={district.id} value={district.name}>
                          {district.name.toUpperCase()}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              {subjectsTableData && (
                <Select
                  placeholder="Select Subjects"
                  isMulti
                  className={styles.select}
                  options={subjectsData}
                  onChange={handleSubjectSelect}
                ></Select>
              )}
              <div className={styles.finalActionArea}>
                <button type="submit" className={styles.actionButton}>
                  Submit
                </button>
                <button
                  type="button"
                  className={`${styles["actionButton"]} ${styles["ml-2"]} ${styles["bg-danger"]}`}
                  onClick={() => setAddingSchool(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className={styles.schoolTable}>
        {!addingSchool && !isViewing && (
          <table border={1}>
            <thead>
              <tr>
                <th>School Name</th>
                <th>School Code</th>
                <th>Contact Number</th>
                <th>District</th>
                <th>Subjects</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schoolsTableData &&
                schoolsTableData.map((schoolItem) => (
                  <tr key={schoolItem.id}>
                    <td>{schoolItem.name.toUpperCase()}</td>
                    <td>{schoolItem.code.toUpperCase()}</td>
                    <td>{schoolItem.contactno}</td>
                    <td>{schoolItem.district.toUpperCase()}</td>
                    <td>{schoolItem.subjects.length}</td>
                    <td>
                      <button onClick={async () => handleDelete(schoolItem.id)}>
                        Delete X
                      </button>
                      <button onClick={() => viewSchool(schoolItem)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <div className={styles.editSchool}>
        {!addingSchool && isViewing && (
          <div>
            <button type="button" onClick={handleViewCancel}>
              Close
            </button>
            <h2>
              {" "}
              {viewingSchoolData?.name} ({viewingSchoolData.code})
            </h2>
            <h3>Contact No: {viewingSchoolData.contactno}</h3>
            <h4> {viewingSchoolData.district.toUpperCase()}</h4>
            <table border={1}>
              <thead>
                <tr>
                  <td>Subject</td>
                  <td>Code</td>
                </tr>
              </thead>
              <tbody>
                {viewingSchoolData.subjects.map((sub) => {
                  return (
                    <tr key={sub.label}>
                      <td>{sub.label}</td>
                      <td>{sub.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSchools;

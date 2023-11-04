import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import styles from "./home.module.css";
import { EditDistricts } from "../components/EditDistricts";
import EditSubjects from "../components/EditSubjects";
import ManageSchools from "../components/ManageSchools";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type NavArea = "home" | "districts" | "subjects" | "";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function HomePage() {
  const [message, setMessage] = useState("No message found");

  const [navarea, setNavArea] = useState<NavArea>("home");

  useEffect(() => {
    window.ipc.on("message", (message: string) => {
      setMessage(message);
    });
    console.log(navarea);
  }, []);

  const sidebar = (
    <div className={styles.sidebar}>
      <p
        onClick={() => setNavArea("home")}
        className={`${styles.button} ${navarea === "home" ? styles.whiteborder : ""
          }`}
      >
        Manage Schools
      </p>
      <p
        onClick={() => setNavArea("districts")}
        className={`${styles.button} ${navarea === "districts" ? styles.whiteborder : ""
          }`}
      >
        Edit Districts
      </p>
      <p
        onClick={() => setNavArea("subjects")}
        className={`${styles.button} ${navarea === "subjects" ? styles.whiteborder : ""
          }`}
      >
        Edit Subjects
      </p>
    </div>
  );

  const content = (
    <div className={styles.content}>
      {navarea === "districts" && <EditDistricts></EditDistricts>}
      {navarea === "subjects" && <EditSubjects></EditSubjects>}
      {navarea === "home" && <ManageSchools></ManageSchools>}
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Head>
        <title>Practical Exam Allocater</title>
      </Head>
      <CssBaseline />
      <div className={styles.window}>
        {sidebar}
        {content}
      </div>
    </ThemeProvider>
  );
}

import { IDistrict, ISchool, ISubject } from "../renderer/types";
import { writeFileSync } from "fs";

export const External_Allocator = (
  Districts: IDistrict[],
  Subjects: ISubject[],
  SchoolData: ISchool[],
) => {
  const district_subject_map = {};
  for (let district of Districts) {
    district_subject_map[district.name] = {};
    for (let sub of Subjects) {
      district_subject_map[district.name][sub.code] = [];
      for (let school of SchoolData) {
        if (
          school.district === district.name &&
          school.subjects.find((subj) => subj.value === sub.code)
        ) {
          district_subject_map[district.name][sub.code].push(school.name);
        }
      }
    }
  }

  const result = {};
  const unique_subjects_in_district = [];
  for (let district in district_subject_map) {
    for (let sub_code in district_subject_map[district]) {
      if (district_subject_map[district][sub_code].length === 1) {
        const school_name = district_subject_map[district][sub_code][0];
        unique_subjects_in_district.push({
          school: school_name,
          subject: sub_code,
          district: district,
        });
        continue;
      }
      for (
        let idx = 0;
        idx < district_subject_map[district][sub_code].length;
        idx++
      ) {
        const school_name = district_subject_map[district][sub_code][idx];
        if (!result[school_name]) {
          result[school_name] = {};
        }
        if (idx === district_subject_map[district][sub_code].length - 1) {
          result[school_name][sub_code] = {};
          result[school_name][sub_code].to =
            district_subject_map[district][sub_code][0];
        } else {
          result[school_name][sub_code] = {};
          result[school_name][sub_code].to =
            district_subject_map[district][sub_code][idx + 1];
        }
      }
      for (
        let idx = district_subject_map[district][sub_code].length - 1;
        idx >= 0;
        idx--
      ) {
        const school_name = district_subject_map[district][sub_code][idx];
        if (idx === 0) {
          result[school_name][sub_code].from =
            district_subject_map[district][sub_code][
            district_subject_map[district][sub_code].length - 1
            ];
        } else {
          result[school_name][sub_code].from =
            district_subject_map[district][sub_code][idx - 1];
        }
      }
    }
  }
  writeFileSync(
    "unique_subjects.json",
    JSON.stringify(unique_subjects_in_district),
  );
  return result;
};

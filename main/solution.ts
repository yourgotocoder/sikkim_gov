import { IDistrict, ISchool, ISubject } from "../renderer/types";
import { writeFileSync } from "fs";

const shuffle = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const externalAllocator = (
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
      const shuffled_dist_data = shuffle(
        district_subject_map[district][sub_code],
      );
      if (shuffled_dist_data.length === 1) {
        const school_name = shuffled_dist_data[0];
        unique_subjects_in_district.push({
          school: school_name,
          subject: sub_code,
          district: district,
        });
        continue;
      }
      for (let idx = 0; idx < shuffled_dist_data.length; idx++) {
        const school_name = district_subject_map[district][sub_code][idx];
        if (!result[school_name]) {
          result[school_name] = {};
        }
        if (idx === shuffled_dist_data.length - 1) {
          result[school_name][sub_code] = {};
          result[school_name][sub_code].to = shuffled_dist_data[0];
        } else {
          result[school_name][sub_code] = {};
          result[school_name][sub_code].to = shuffled_dist_data[idx + 1];
        }
      }
      for (let idx = shuffled_dist_data.length - 1; idx >= 0; idx--) {
        const school_name = shuffled_dist_data[idx];
        if (idx === 0) {
          result[school_name][sub_code].from =
            shuffled_dist_data[shuffled_dist_data.length - 1];
        } else {
          result[school_name][sub_code].from = shuffled_dist_data[idx - 1];
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

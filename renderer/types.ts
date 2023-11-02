export interface IDistrict {
  id?: number;
  name: string;
}

export interface ISubject {
  id?: number;
  title: string;
  code: string;
}

interface SubjectData {
  value: string;
  label: string;
}

export interface ISchool {
  id?: number;
  name: string;
  code: string;
  district: string;
  contactno: string;
  subjects: SubjectData[];
}

export const parseStudentCollegeId = (
  collegeId: string
) => {

  const branchCode = collegeId[1] as string;

  const admissionYear = Number(
    "20" + collegeId.slice(2, 4)
  );

  const branchMap: Record<string, string> = {

    "1": "CSE",
    "2": "IT",
    "3": "ETC",
    "4": "EEE",
    "5": "CE",

  };

  return {

    admissionYear,

    branch:
      branchMap[branchCode] || "UNKNOWN",

  };
};
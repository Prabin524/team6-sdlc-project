const STORAGE_KEY = "attendance_records";

export const initAttendanceDB = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

export const getAttendance = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

export const saveAttendance = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

// Mark (create/update) attendance for a user on a date
export const markAttendance = (record) => {
  const records = getAttendance();

  // unique by email + date
  const index = records.findIndex(
    (r) => r.email === record.email && r.date === record.date
  );

  if (index !== -1) {
    records[index] = { ...records[index], ...record };
  } else {
    records.push(record);
  }

  saveAttendance(records);
  return { success: true };
};

export const deleteAttendance = (email, date) => {
  const records = getAttendance().filter(
    (r) => !(r.email === email && r.date === date)
  );
  saveAttendance(records);
  return { success: true };
};

// Helper: get attendance for one employee
export const getAttendanceByEmail = (email) => {
  return getAttendance().filter((r) => r.email === email);
};

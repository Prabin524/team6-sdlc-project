const STORAGE_KEY = "attendance_records";


//   INITIALIZE DB
 
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

const today = () => new Date().toISOString().split("T")[0];

const convertTo24 = (timeStr) => {
  if (!timeStr) return null;

  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes, seconds] = time.split(":");

  hours = parseInt(hours, 10);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
};

const calculateDuration = (clockIn, clockOut) => {
  const start = new Date(`2000-01-01T${clockIn}`);
  const end = new Date(`2000-01-01T${clockOut}`);

  const diffMs = end - start;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

/* 
   SYNC EMPLOYEE INFO
 */
const syncEmployeeInfo = (entry) => {
  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const emp = employees.find((e) => e.email === entry.email);

  entry.fullname = emp?.fullname || entry.fullname || "-";
  entry.department = emp?.department || entry.department || "-";

  return entry;
};

   //CLOCK IN
export const clockIn = (email) => {
  const records = getAttendance();

  const exists = records.find(
    (r) => r.email === email && r.date === today()
  );

  if (exists) {
    return { success: false, message: "Already clocked in today!" };
  }

  let newEntry = {
    email,
    date: today(),
    clockIn: new Date().toLocaleTimeString(),
    clockOut: null,

    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,

    status: "In Progress",
    note: "-"
  };

  // inject fullname + department
  newEntry = syncEmployeeInfo(newEntry);

  records.push(newEntry);
  saveAttendance(records);

  return { success: true, entry: newEntry };
};


   //CLOCK OUT
export const clockOut = (email) => {
  const records = getAttendance();

  let entry = records.find(
    (r) => r.email === email && r.date === today()
  );

  if (!entry) {
    return { success: false, message: "You haven't clocked in today!" };
  }

  if (entry.clockOut) {
    return { success: false, message: "Already clocked out today!" };
  }

  // save AM/PM string
  entry.clockOut = new Date().toLocaleTimeString();

  // calculate duration
  const { hours, minutes, seconds } = calculateDuration(
    convertTo24(entry.clockIn),
    convertTo24(entry.clockOut)
  );

  entry.totalHours = hours;
  entry.totalMinutes = minutes;
  entry.totalSeconds = seconds;
  entry.status = "Completed";

  // sync employee name & department
  entry = syncEmployeeInfo(entry);

  saveAttendance(records);

  return { success: true, entry };
};

/* 
   GETTERS
 */
export const getAttendanceByEmail = (email) => {
  return getAttendance().filter((r) => r.email === email);
};

export const getTodayAttendance = (email) => {
  return (
    getAttendance().find(
      (r) => r.email === email && r.date === today()
    ) || null
  );
};

/* 
   HR MANUAL OVERRIDE
 */
export const markAttendance = (record) => {
  const records = getAttendance();

  const index = records.findIndex(
    (r) => r.email === record.email && r.date === record.date
  );

  // Recalculate if time exists
  if (record.clockIn && record.clockOut) {
    const { hours, minutes, seconds } = calculateDuration(
      convertTo24(record.clockIn),
      convertTo24(record.clockOut)
    );

    record.totalHours = hours;
    record.totalMinutes = minutes;
    record.totalSeconds = seconds;
    record.status = "Completed";
  }

  // auto-sync employee info
  record = syncEmployeeInfo(record);

  if (index !== -1) {
    records[index] = { ...records[index], ...record };
  } else {
    records.push(record);
  }

  saveAttendance(records);
  return { success: true };
};

//   DELETE ATTENDANCE
export const deleteAttendance = (email, date) => {
  const records = getAttendance().filter(
    (r) => !(r.email === email && r.date === date)
  );

  saveAttendance(records);
  return { success: true };
};

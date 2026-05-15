/**
 * Updated Google Apps Script for Hi5 Attendance
 * Organizes data by Coach, Centre, and Student with Date/Day/Time details.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();
    const currentTime = timestamp.toLocaleTimeString();

    // 1. Log to Centre-specific Sheet
    const sheetName = data.centre || "General_Attendance";
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Header row
      sheet.appendRow(["Coach Name", "Centre Name", "Date", "Day", "Session Time", "Hours Worked", "Student Name", "Attendance Status", "Log Timestamp"]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#d9ead3").setBorder(true, true, true, true, true, true);
      sheet.setFrozenRows(1);
    }
    
    // Append rows for each student
    // This keeps the Coach Name beside/prominent for every student record
    data.students.forEach(student => {
      sheet.appendRow([
        data.coach,
        data.centre,
        data.date,
        data.day,
        data.time || currentTime, 
        data.hours || "N/A",
        student.name,
        student.status,
        timestamp
      ]);
    });

    // Optional: Add a blank row to separate sessions visually
    sheet.appendRow(["", "", "", "", "", "", "", ""]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "Data organized by Coach and Centre" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

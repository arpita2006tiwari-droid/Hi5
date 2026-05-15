/**
 * Updated Google Apps Script for Hi5 Attendance
 * Organizes data by BOTH Coach-specific sheets and Centre-specific sheets.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();
    const currentTime = timestamp.toLocaleTimeString();

    // Helper function to get or create a sheet with headers
    function getOrCreateSheet(name, headers, color) {
      let sheet = ss.getSheetByName(name);
      if (!sheet) {
        sheet = ss.insertSheet(name);
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground(color).setBorder(true, true, true, true, true, true);
        sheet.setFrozenRows(1);
      }
      return sheet;
    }

    const headers = ["Coach Name", "Centre Name", "Date", "Day", "Session Time", "Hours Worked", "Student Name", "Attendance Status", "Log Timestamp"];

    // 1. Log to COACH-specific Sheet (Requested)
    const coachSheetName = "Coach: " + (data.coach || "Unknown");
    const coachSheet = getOrCreateSheet(coachSheetName, headers, "#cfe2f3"); // Light blue for coach sheets

    // 2. Log to CENTRE-specific Sheet (Maintains site records)
    const centreSheetName = "Centre: " + (data.centre || "General");
    const centreSheet = getOrCreateSheet(centreSheetName, headers, "#d9ead3"); // Light green for centre sheets

    // Append rows to both sheets
    data.students.forEach(student => {
      const rowData = [
        data.coach,
        data.centre,
        data.date,
        data.day,
        data.time || currentTime,
        data.hours || "N/A",
        student.name,
        student.status,
        timestamp
      ];
      
      coachSheet.appendRow(rowData);
      centreSheet.appendRow(rowData);
    });

    // Add visual separation (blank row)
    coachSheet.appendRow(new Array(headers.length).fill(""));
    centreSheet.appendRow(new Array(headers.length).fill(""));

    return ContentService.createTextOutput(JSON.stringify({ "result": "success", "message": "Logged to both Coach and Centre sheets" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

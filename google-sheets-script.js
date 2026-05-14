// Google Apps Script for Hi5 Attendance App
// Instructions: Paste this into Extensions > Apps Script in your Google Sheet

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Log Attendance by Centre
    const centreSheetName = data.centre || "General_Attendance";
    let centreSheet = ss.getSheetByName(centreSheetName);
    
    if (!centreSheet) {
      centreSheet = ss.insertSheet(centreSheetName);
      centreSheet.appendRow(["Date", "Day", "School", "Student Name", "Status", "Coach", "Timestamp"]);
      centreSheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    // Log each student
    data.students.forEach(student => {
      centreSheet.appendRow([
        data.date,
        data.day,
        data.school || "N/A",
        student.name,
        student.status,
        data.coach,
        new Date()
      ]);
    });

    // 2. Log Coach Performance
    const coachSheetName = "Coach_Performance_Log";
    let coachSheet = ss.getSheetByName(coachSheetName);
    
    if (!coachSheet) {
      coachSheet = ss.insertSheet(coachSheetName);
      coachSheet.appendRow(["Date", "Day", "Coach Name", "Centre", "Hours Worked", "Timestamp"]);
      coachSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#e6f3ff");
    }
    
    coachSheet.appendRow([
      data.date,
      data.day,
      data.coach,
      data.centre,
      data.hours,
      new Date()
    ]);

    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

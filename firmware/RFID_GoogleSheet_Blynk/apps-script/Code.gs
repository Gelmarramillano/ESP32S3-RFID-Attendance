const ATTENDANCE_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
const NEW_ATTENDANCE_TAB = 'Attendance_2026';

function doPost(e) {
  const reply = message => ContentService.createTextOutput(message);
  const input = e && e.parameter ? e.parameter : {};
  const secret = PropertiesService.getScriptProperties()
    .getProperty('ATTENDANCE_KEY');

  if (!secret || input.key !== secret) {
    return reply('ERROR: Unauthorized');
  }

  const cards = {
    'A1B2C3D4': 'DEMO USER 1',
    '11223344': 'DEMO USER 2',
    '55667788': 'DEMO USER 3'
  };

  const uid = String(input.card_id || '').trim().toUpperCase();
  const action = String(input.action || '');

  if (!/^(?:[0-9A-F]{8}|[0-9A-F]{14}|[0-9A-F]{20})$/.test(uid) ||
      !Object.prototype.hasOwnProperty.call(cards, uid) ||
      !['TIME IN', 'TIME OUT'].includes(action)) {
    return reply('ERROR: Invalid card or action');
  }

  const sheet = SpreadsheetApp.openById(ATTENDANCE_SPREADSHEET_ID)
    .getSheetByName(NEW_ATTENDANCE_TAB);

  if (!sheet) {
    return reply('ERROR: Attendance tab not found');
  }

  const now = new Date();
  const zone = 'Asia/Riyadh';

  sheet.appendRow([
    Utilities.formatDate(now, zone, 'yyyy-MM-dd'),
    Utilities.formatDate(now, zone, 'HH:mm:ss'),
    cards[uid],
    uid,
    action
  ]);

  return reply('OK');
}

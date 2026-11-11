/**
 * RSVP receiver for Júlia's 1st birthday.
 * Bound to the "Confirmações – Aniversário Júlia" Google Sheet
 * (Extensions → Apps Script). Deploy as a Web app:
 *   Execute as: Me  ·  Who has access: Anyone
 */

const SHEET_NAME = 'Confirmações';
const MAX_PEOPLE = 20;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: bots fill hidden fields, people don't.
    if (data.website) {
      return json_({ ok: true });
    }

    const nome = clean_(data.nome, 80);
    if (!nome) {
      return json_({ ok: false, error: 'missing_name' });
    }

    const vai = data.vai === 'Não' ? 'Não' : 'Sim';
    const adultos = vai === 'Sim' ? toInt_(data.adultos) : 0;
    const criancas = vai === 'Sim' ? toInt_(data.criancas) : 0;

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const row = nextRow_(sheet);

    sheet.getRange(row, 1, 1, 8).setValues([[
      new Date(),
      nome,
      vai,
      adultos,
      criancas,
      adultos + criancas,
      clean_(data.telefone, 30),
      clean_(data.mensagem, 500),
    ]]);
    sheet.getRange(row, 1).setNumberFormat('dd/mm/yyyy hh:mm');

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Lets you open the Web app URL in a browser to check it is live. */
function doGet() {
  return json_({ ok: true, service: 'rsvp-julia' });
}

/** First empty row in column A (the summary in J:K doesn't push rows down). */
function nextRow_(sheet) {
  const values = sheet.getRange('A:A').getValues();
  let last = 0;
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] !== '') last = i + 1;
  }
  return last + 1;
}

function toInt_(value) {
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(n, MAX_PEOPLE);
}

/** Trim, cap length, and stop text being read as a formula. */
function clean_(value, maxLen) {
  let s = String(value == null ? '' : value).trim().slice(0, maxLen);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

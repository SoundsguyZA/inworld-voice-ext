chrome.runtime.onInstalled.addListener(async () => {
  const s = await chrome.storage.local.get(Object.keys(DEFAULTS));
  const merged = { ...DEFAULTS, ...s };
  await chrome.storage.local.set(merged);
  chrome.contextMenus.create({ id: 'iw-read', title: 'Read with InWorld', contexts: ['selection'] });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'iw-read' && tab?.id && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, { type: 'IW_SPEAK', text: info.selectionText });
  }
});
chrome.commands.onCommand.addListener(async (cmd) => {
  if (cmd === 'stt-paste') {
    const s = await chrome.storage.local.get(DEFAULTS);
    try {
      const clip = await navigator.clipboard.read();
      for (const item of clip) {
        const t = item.types.find(t => t.startsWith('audio/'));
        if (!t) continue;
        const blob = await item.getType(t);
        const ab = await blob.arrayBuffer();
        const b64 = btoa(String.fromCharCode(...new Uint8Array(ab)));
        const resp = await chrome.runtime.sendMessage({ type: 'IW_STT', b64, settings: s });
        chrome.notifications.create({ type: 'basic', iconUrl: 'icon.png', title: 'InWorld STT', message: resp.transcript || '(empty)' });
      }
    } catch (e) { console.error('stt', e); }
  }
});
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'IW_SPEAK') { speakText(msg.text).then(r => sendResponse(r)); return true; }
  if (msg.type === 'IW_STT') { sttAudio(msg.b64, msg.settings).then(r => sendResponse(r)); return true; }
});
async function speakText(text) {
  const s = await chrome.storage.local.get(DEFAULTS);
  if (!s.iwKey) return { error: 'No API key. Open the popup and paste your InWorld key.' };
  const body = { text, voiceId: s.voiceId || 'Dennis', modelId: s.modelId || 'inworld-tts-1', audioConfig: { audioEncoding: 'MP3' } };
  const r = await fetch('https://api.inworld.ai/tts/v1/voice', { method: 'POST', headers: { 'Authorization': 'Basic ' + s.iwKey, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) return { error: 'TTS ' + r.status + ': ' + (await r.text()).slice(0, 120) };
  const buf = await r.arrayBuffer();
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return { audioB64: b64 };
}
async function sttAudio(b64, settings) {
  const conf = { modelId: settings.sttModelId || 'groq/whisper-large-v3', languageCode: settings.sttLang || 'en-ZA', sampleRateHertz: settings.sttSampleRate || 16000, audioEncoding: settings.audioEncoding || 2 };
  const boundary = '----iwvoice' + Date.now();
  const enc = new TextEncoder();
  const audioBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const CRLF = String.fromCharCode(13, 10);
  const pre = enc.encode(
    '--' + boundary + CRLF +
    'Content-Disposition: form-data; name="transcribeConfig"' + CRLF +
    'Content-Type: application/json' + CRLF + CRLF +
    JSON.stringify(conf) + CRLF
  );
  const fileHead = enc.encode(
    '--' + boundary + CRLF +
    'Content-Disposition: form-data; name="file"; filename="audio.wav"' + CRLF +
    'Content-Type: audio/wav' + CRLF + CRLF
  );
  const tail = enc.encode(CRLF + '--' + boundary + '--' + CRLF);
  const blob = new Blob([pre, fileHead, audioBytes, tail], { type: 'multipart/form-data; boundary=' + boundary });
  const r = await fetch('https://api.inworld.ai/stt/v1/transcribe', { method: 'POST', headers: { 'Authorization': 'Basic ' + (settings.iwKey || '') }, body: blob });
  if (!r.ok) return { error: 'STT ' + r.status };
  const d = await r.json();
  return { transcript: d.transcription && d.transcription.transcript || '' };
}

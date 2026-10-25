const DEFAULTS = { iwKey:'', modelId:'inworld-tts-1', voiceId:'Dennis', sttModelId:'groq/whisper-large-v3', sttLang:'en-ZA' };
const $ = id => document.getElementById(id);
chrome.storage.local.get(Object.keys(DEFAULTS)).then(s => { $('k').value = s.iwKey||''; $('v').value = s.voiceId||'Dennis'; $('m').value = s.modelId||'inworld-tts-1'; });
$('save').onclick = async () => {
  await chrome.storage.local.set({ iwKey: $('k').value.trim(), voiceId: $('v').value.trim() || 'Dennis', modelId: $('m').value.trim() || 'inworld-tts-1' });
  $('msg').textContent = 'Saved.';
};
$('test').onclick = async () => {
  $('msg').textContent = 'Testing...';
  const resp = await chrome.runtime.sendMessage({ type: 'IW_SPEAK', text: 'Howzit boet, link is green.' });
  if (resp && resp.error) { $('msg').textContent = resp.error; return; }
  if (!resp || !resp.audioB64) { $('msg').textContent = 'No audio'; return; }
  const bytes = Uint8Array.from(atob(resp.audioB64), c => c.charCodeAt(0));
  new Audio(URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }))).play();
  $('msg').textContent = '\u2713 Voice OK';
};

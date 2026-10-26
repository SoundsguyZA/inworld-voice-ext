let btn = null;
document.addEventListener('mouseup', () => {
  setTimeout(() => {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text.length > 3 && text.length < 3000) showBtn(sel, text); else hideBtn();
  }, 200);
});
function showBtn(sel, text) {
  hideBtn();
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  btn = document.createElement('div');
  btn.textContent = '\u25B6';
  Object.assign(btn.style, {
    position: 'fixed', left: (rect.left + window.scrollX) + 'px', top: (rect.top - 28) + 'px',
    zIndex: 2147483647, background: '#0d9488', color: '#fff', borderRadius: '4px',
    padding: '2px 8px', cursor: 'pointer', fontSize: '12px', lineHeight: '20px', boxShadow: '0 2px 6px rgba(0,0,0,.3)'
  });
  btn.onclick = () => {
    btn.textContent = '\u23F3';
    chrome.runtime.sendMessage({ type: 'IW_SPEAK', text }, (resp) => {
      if (!resp || resp.error) { btn.textContent = '\u26A0'; setTimeout(hideBtn, 1500); return; }
      playAudio(resp.audioB64);
      btn.textContent = '\u25A0';
      setTimeout(hideBtn, 1500);
    });
  };
  document.documentElement.appendChild(btn);
}
let curAudio = null;
function playAudio(b64) {
  if (curAudio) { curAudio.pause(); curAudio = null; }
  try {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'audio/mpeg' });
    curAudio = new Audio(URL.createObjectURL(blob));
    curAudio.play().catch(() => { curAudio.play(); });
  } catch (e) { console.error('IW playback', e); }
}
function hideBtn() { if (btn) { btn.remove(); btn = null; } }

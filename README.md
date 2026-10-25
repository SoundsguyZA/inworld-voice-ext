# InWorld Voice Ext (Kai Build)

Chrome MV3 extension: select-any-text TTS + clipboard-audio STT, running on **InWorld** endpoints (not ElevenLabs).

## Why
Rob's stack speaks with a Durban accent. InWorld is ~90% cheaper than ElevenLabs and handles SA accents + custom vocabulary better (Nemotron, Aluna, Gurovich, Kai, POPIA...).

## Features
- Select text on any page -> teal play button appears -> click = hear it in your chosen InWorld voice
- Right-click -> "Read with InWorld" on a selection
- Alt+Shift+V -> transcribe clipboard audio (WhatsApp voice notes etc.) via InWorld STT
- Popup config: API key, voice, model (defaults: `inworld-tts-1`, voice `Dennis`)
- Works on Chrome + Edge + most Chromium; Firefox port pending (different manifest namespace)

## Endpoints (verified live 2026-10-25, see docs/PROOF.md)
- TTS: `POST https://api.inworld.ai/tts/v1/voice`
- STT: `POST https://api.inworld.ai/stt/v1/transcribe` (multipart, config part FIRST, file part SECOND - streamed)

## Install (load unpacked)
1. Chrome -> chrome://extensions -> Developer mode ON
2. Load unpacked -> this folder
3. Click the extension icon -> paste your InWorld **Basic** key -> Save -> Test Voice
4. Go select something. Hear Durban read it back.

## Permissions used
storage (settings), offscreen (audio), contextMenus (right-click), commands (hotkey). No analytics, no developer server. Your key lives in chrome.storage.local only.

## Origin story
Built by Kai (on Rob Barenbrug's phone, via the HP's Operit PC Agent) after the ElevenLabs Human Reader path proved too expensive and accent-poor for SA use. Reuses the Human Reader UX pattern (selection + play icon) with InWorld backend.

License: MIT. Repo: SoundsguyZA/inworld-voice-ext

// InWorld endpoints (verified live 2026-10-25, see repo docs/PROOF.md)
const IW_TTS = 'https://api.inworld.ai/tts/v1/voice';
const IW_STT = 'https://api.inworld.ai/stt/v1/transcribe';
const DEFAULTS = {
  iwKey: '', modelId: 'inworld-tts-1', voiceId: 'Dennis', speed: 1,
  sttModelId: 'groq/whisper-large-v3', sttLang: 'en-ZA', sttSampleRate: 16000,
  audioEncoding: 2, showSelectionButton: true
};

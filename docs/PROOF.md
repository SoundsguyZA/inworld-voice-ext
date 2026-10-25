# Live verification receipts (2026-10-25, SAST)

## TTS proof
- Endpoint POST https://api.inworld.ai/tts/v1/voice
- Request body: {"text":"Howzit boet, link is green.","voiceId":"Dennis","modelId":"inworld-tts-1","audioConfig":{"audioEncoding":"MP3"}}
- Header: Authorization: Basic <key from label 'Kai' in InWorld TTS.txt>
- Response: 200 OK, 39,509 bytes audio/mpeg. Saved locally not committed.

## STT proof
- Endpoint POST https://api.inworld.ai/stt/v1/transcribe (multipart/form-data)
- Part order MATTERS: config part first, then file part (server streams; file part alone => "audio_data is required", file-before-config => "send the transcribe config before the file")
- audio_encoding must be numeric enum (2 = LINEAR16). String names rejected.
- modelId on STT: 'groq/whisper-large-v3' accepted. 'inworld-asr-v1','inworld-1-asr','inworld-autoserkits-asr-v1' rejected (2026-10-25).
- Test audio: synthetic 440Hz sine WAV 1s 16kHz. Response: {"transcription":{"transcript":" .","isFinal":true,...},"usage":{"transcribedAudioMs":1000,"modelId":"groq/whisper-large-v3"}}

## Voice catalog note
- 'Dennis' works on phone-key workspace. Rob's designed Kai voice 'iurikimvdlgxqbcccweg' belongs to the Operit workspace key (label 'Aluna Operit') - test that key before wiring it in.

## Env that generated this
- Build: Kai in Operit (super_admin proot Ubuntu, phone) driving Windows HP 15-fc0x via Operit PC Agent v0.2.2 on Tailscale mesh.

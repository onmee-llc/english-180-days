# Mic Translate Feature — Design

## Context

Companion feature to `2026-08-17-mobile-app-design.md`, living inside the
new mobile app. The user has limited English vocabulary and wants to speak
English with their kids day-to-day. This feature lets them speak a sentence
in Vietnamese, get it turned into a natural, grammatically correct English
sentence with pronunciation help, so they can say it out loud in the moment.

## Goals

- Hold-to-record mic input, speaks Vietnamese.
- On release, produce: a natural English sentence suitable for a parent
  talking to their kids, its IPA phonetic transcription, and a short
  Vietnamese explanation of what was corrected/why.
- Works well enough for real-time use in a conversation (fast, low-friction).
- Keeps a local history of past lookups as a personal phrasebook.

## Non-goals

- No text-to-speech playback in v1 (explicitly not requested).
- No cloud STT (e.g. Whisper) — on-device STT only, to stay free and offline
  for the transcription step.
- Not available on the web app — mobile app only in v1.

## Architecture

**Speech-to-text**: Capacitor Speech Recognition plugin, locale `vi-VN`,
using the OS's built-in on-device recognizer (free, works offline, no audio
leaves the device for this step).

**Grammar/translation audit**: Claude API. The transcribed Vietnamese text
is sent with a system prompt instructing Claude to: translate to natural
spoken English appropriate for a parent addressing their children, correct
any grammar issues (there are none in the source Vietnamese, but a bad
transcription might introduce ambiguity — the prompt should ask Claude to
infer intent charitably), and return the corrected English sentence, its IPA
transcription, and a short Vietnamese-language explanation of any notable
word choice / phrasing decision. Response is parsed into a fixed
`{englishSentence, ipa, explanation}` shape (structured/JSON output from
Claude).

**API key**: entered once in Settings (see mobile app spec), stored via
Capacitor Secure Storage — never hardcoded or committed to the repo.

**History**: each successful lookup (Vietnamese input, English output, IPA,
explanation, timestamp) is appended to a local list persisted via Capacitor
Preferences. Viewable/scrollable in-app as a phrasebook. Local only — not
synced to Firestore (personal scratch data, not learning-progress data).

## Data flow

1. User presses and holds the mic button → start recording, start STT
   session (`vi-VN`).
2. Live partial transcript shown while holding, for feedback.
3. User releases → STT finalizes → Vietnamese text captured.
4. Vietnamese text sent to Claude API.
5. Response parsed into `{englishSentence, ipa, explanation}`, displayed.
6. Entry appended to local history.

## Error handling

- **No mic permission**: prompt the OS permission dialog; if denied, show
  a message explaining the feature needs mic access.
- **STT returns empty/no speech detected**: show "didn't catch that, try
  again" — no API call made (avoid wasting a Claude call on empty input).
- **Claude API failure** (network, rate limit, invalid/missing key): show an
  inline error, but keep the already-transcribed Vietnamese text visible and
  offer a retry button, so the user never loses what they just said.
- **No API key configured**: route to Settings before allowing first use of
  this screen.

## Testing

- Manual: record a handful of known Vietnamese phrases, confirm output
  fields are populated and sensible.
- One small assert-based test for the Claude response parser: given a
  sample API response, correctly extracts `englishSentence` / `ipa` /
  `explanation`, and fails loudly on a malformed response rather than
  silently showing blank fields. This is the one piece of real branching
  logic in the feature, so it gets a test; the rest is UI wiring.

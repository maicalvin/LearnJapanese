// ============================================================
//  TABIJI — Voice Practice Module
//  Browser Web Speech API integration
// ============================================================

const VoicePractice = (() => {

  // ── State ──────────────────────────────────────────────────
  let recognition = null;
  let isRecording  = false;
  let onResultCb   = null;
  let onErrorCb    = null;

  // ── Speech Synthesis (TTS) ─────────────────────────────────
  /**
   * Speak a Japanese phrase using browser TTS.
   * Prefers a Japanese voice if available.
   */
  function speak(text, onEnd) {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'ja-JP';
    utterance.rate  = 0.85;   // slightly slower for learning
    utterance.pitch = 1.0;

    // Try to select a native Japanese voice
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jpVoice) utterance.voice = jpVoice;

    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }

  // ── Speech Recognition (STT) ───────────────────────────────
  /**
   * Start recording the user's voice.
   * Calls onResultCb({ transcript, score, chips, tip }) on completion.
   */
  function startRecording(targetText, targetRomaji, onResult, onError) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Try Chrome on desktop or Android.');
      return;
    }

    if (isRecording) {
      stopRecording();
      return;
    }

    onResultCb = onResult;
    onErrorCb  = onError;

    recognition = new SpeechRecognition();
    recognition.lang           = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous     = false;

    recognition.onstart = () => {
      isRecording = true;
    };

    recognition.onresult = (event) => {
      isRecording = false;
      const results    = event.results[0];
      const transcript = results[0].transcript.trim();
      const confidence = results[0].confidence; // 0–1 from browser

      const feedback = analysePronunciation(targetText, targetRomaji, transcript, confidence);
      if (onResultCb) onResultCb(feedback);
    };

    recognition.onerror = (event) => {
      isRecording = false;
      const msg = recognitionErrorMessage(event.error);
      if (onErrorCb) onErrorCb(msg);
    };

    recognition.onend = () => {
      isRecording = false;
    };

    try {
      recognition.start();
    } catch (e) {
      isRecording = false;
      if (onErrorCb) onErrorCb('Could not start recording: ' + e.message);
    }
  }

  function stopRecording() {
    if (recognition) {
      recognition.stop();
      recognition = null;
    }
    isRecording = false;
  }

  function getIsRecording() { return isRecording; }

  // ── Pronunciation Analysis ─────────────────────────────────
  /**
   * Compare the user's transcript with the target phrase.
   * Returns a feedback object.
   *
   * Because browser STT returns Japanese text, we compare
   * character-by-character against the target. Romaji is used
   * to generate pronunciation tips.
   */
  function analysePronunciation(targetJP, targetRomaji, transcript, confidence) {
    // Normalise: remove punctuation, spaces, full-width chars
    const clean = s => s.replace(/[。、！？\s\u3000]/g, '');
    const target     = clean(targetJP);
    const heard      = clean(transcript);

    // ── Character-level diff ───────────────────────────────
    const chips = buildChips(target, heard);

    // ── Score calculation ──────────────────────────────────
    // Blend character match ratio with browser confidence
    const matchRatio = charMatchRatio(target, heard);
    const browserConf = (typeof confidence === 'number' && confidence > 0) ? confidence : 0.5;
    const rawScore  = Math.round((matchRatio * 0.7 + browserConf * 0.3) * 100);
    const score     = Math.min(100, Math.max(0, rawScore));

    // ── Improvement tip ───────────────────────────────────
    const tip = buildTip(score, targetRomaji, target, heard);

    return {
      transcript,
      score,
      chips,
      tip,
      targetJP,
      targetRomaji
    };
  }

  /**
   * Longest-common-subsequence to highlight correct vs incorrect chars.
   * Returns array of { char, status: 'correct' | 'incorrect' | 'missing' }.
   */
  function buildChips(target, heard) {
    // Simple per-character comparison aligned by index
    const chips = [];
    const maxLen = Math.max(target.length, heard.length);

    // Build chips from the HEARD text perspective
    for (let i = 0; i < heard.length; i++) {
      if (i < target.length && heard[i] === target[i]) {
        chips.push({ char: heard[i], status: 'correct' });
      } else {
        chips.push({ char: heard[i], status: 'incorrect' });
      }
    }

    // Mark missing target characters
    if (target.length > heard.length) {
      for (let i = heard.length; i < target.length; i++) {
        chips.push({ char: target[i], status: 'missing' });
      }
    }

    return chips;
  }

  /**
   * Simple character match ratio (Jaccard-style over LCS).
   */
  function charMatchRatio(target, heard) {
    if (!target.length) return 0;
    let matches = 0;
    const usedIdx = new Set();
    for (let i = 0; i < heard.length; i++) {
      for (let j = 0; j < target.length; j++) {
        if (!usedIdx.has(j) && heard[i] === target[j]) {
          matches++;
          usedIdx.add(j);
          break;
        }
      }
    }
    return matches / Math.max(target.length, heard.length);
  }

  function buildTip(score, romaji, target, heard) {
    if (score >= 90) {
      return '🌟 Excellent! Your pronunciation is very natural. Keep it up!';
    }
    if (score >= 75) {
      return '👍 Great job! Minor differences — try speaking at a slightly slower pace and focus on each syllable.';
    }
    if (score >= 55) {
      return `💪 Good effort! Try breaking the phrase into syllables using the romaji: "${romaji}" — then say each part slowly before putting it together.`;
    }
    if (score >= 30) {
      return `🔁 Keep practicing! Listen to the native pronunciation first, then mimic exactly. Romaji guide: "${romaji}"`;
    }
    return `🎯 Let's work on this one! Start by listening, then repeat just the first word. The full phrase in romaji: "${romaji}"`;
  }

  function recognitionErrorMessage(code) {
    const messages = {
      'no-speech':         'No speech detected. Please speak clearly into your microphone.',
      'audio-capture':     'Microphone not found. Please check your microphone settings.',
      'not-allowed':       'Microphone access denied. Please allow microphone access in your browser settings.',
      'network':           'Network error. Please check your internet connection.',
      'aborted':           'Recording was interrupted. Please try again.',
      'service-not-allowed': 'Speech service not available. Try using Chrome browser.',
    };
    return messages[code] || 'Recognition error. Please try again.';
  }

  // ── Public API ─────────────────────────────────────────────
  return {
    speak,
    startRecording,
    stopRecording,
    getIsRecording,
    analysePronunciation  // exposed for testing
  };

})();

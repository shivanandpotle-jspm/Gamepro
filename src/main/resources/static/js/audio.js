/**
 * Memory Flip - Master
 * Audio Module: High-performance Web Audio API Synthesizer
 */
const AudioManager = (() => {
    let audioCtx = null;
    let muted = Storage.isSoundMuted();

    function initContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function isMuted() {
        return muted;
    }

    function toggleMute() {
        muted = !muted;
        Storage.setSoundMuted(muted);
        return muted;
    }

    // Play card flip sound (subtle click / woosh)
    function playFlip() {
        if (muted) return;
        initContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Play pair match sound (sweet major third chime)
    function playMatch() {
        if (muted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const start = now + index * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(start);
            osc.stop(start + 0.35);
        });
    }

    // Play mismatch sound (gentle low buzz)
    function playMismatch() {
        if (muted) return;
        initContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.2);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Play hint sound (magical shimmer)
    function playHint() {
        if (muted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        [600, 800, 1000, 1200].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const start = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.15, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(start);
            osc.stop(start + 0.2);
        });
    }

    // Play victory fanfare
    function playVictory() {
        if (muted) return;
        initContext();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const notes = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.4 }  // C6
        ];

        let offset = 0;
        notes.forEach(note => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const start = now + offset;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(start);
            osc.stop(start + note.d);
            offset += note.d * 0.85;
        });
    }

    // Play UI click sound
    function playClick() {
        if (muted) return;
        initContext();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const now = audioCtx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
    }

    return {
        initContext,
        isMuted,
        toggleMute,
        playFlip,
        playMatch,
        playMismatch,
        playHint,
        playVictory,
        playClick
    };
})();

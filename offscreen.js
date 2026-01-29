chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'PLAY_SOUND') {
        playAudio(msg.sound);
    }
});

function playAudio(type) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'rise') {
        // "Sharper" rising tone (Exponential ramp to high pitch)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(1500, now + 0.6);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.6);

        oscillator.start(now);
        oscillator.stop(now + 0.6);

    } else if (type === 'fall') {
        // "Abyss" falling tone (Mario pipe style)
        oscillator.type = 'sawtooth'; // Rougher sound for drop
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 1.0);

        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 1.0);

        oscillator.start(now);
        oscillator.stop(now + 1.0);

    } else {
        // Default beep
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.5;
        oscillator.start();
        setTimeout(() => oscillator.stop(), 500);
    }
}

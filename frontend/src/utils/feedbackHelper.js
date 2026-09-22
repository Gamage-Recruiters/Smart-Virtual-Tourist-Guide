const criticalSound = new Audio("/assets/sounds/emergency-alert.mp3");
const highSound = new Audio("/assets/sounds/notification-chime.mp3");

let isPlaying = false;

const resetPlayingState = () => {
  isPlaying = false;
};

criticalSound.addEventListener("ended", resetPlayingState);
highSound.addEventListener("ended", resetPlayingState);

export const triggerSafetyFeedback = (priority) => {
  const isMuted = localStorage.getItem("mute_alerts") === "true";
  if (isMuted) return; 

  const p = priority?.toLowerCase();

  // --- Haptic Feedback (Vibration) ---
  if ("vibrate" in navigator) {
    if (p === "critical") {
      navigator.vibrate([200, 100, 200, 100, 500]); // SOS pattern
    } else if (p === "high") {
      navigator.vibrate([100, 50, 100]); // Short pulse
    }
  }

  // --- Audio Feedback ---
  if (isPlaying) return;

  const alertSound = p === "critical" ? criticalSound : highSound;

  isPlaying = true;
  alertSound.currentTime = 0;

  alertSound
    .play()
    .then(() => {
    })
    .catch((err) => {
      console.warn("Audio play blocked by browser (Autoplay Policy). User interaction needed.");
      isPlaying = false; 
    });
};
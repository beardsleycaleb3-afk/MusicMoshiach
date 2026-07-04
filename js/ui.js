// js/ui.js
// WHAT DOES IT DO? Manages all user interface elements, playlist, color changes, and HUD
// WHAT DOES IT OWN? Playlist DOM, track list, mode label, color state
// WHAT DOES IT NEED? Song titles and playlist data
// WHAT DOES IT INPUT? User clicks on buttons and playlist items
// WHAT DOES IT OUTPUT? Updated DOM elements
// WHAT DOES IT CONNECT TO? Orchestrator, Audio, Visual
// WHAT DOES IT HELP? Provides intuitive touch-friendly controls
// WHAT DOES IT RETURN? Nothing (DOM mutations)
// WHAT DOES IT START? Playlist building on init
// WHAT DOES IT FINISH? Nothing

import { songTitles, playlist } from '../index.js'; // or import from utils if you prefer

export const UI = {
  togglePlaylist(e) {
    if (e) e.stopPropagation();
    const screen = document.getElementById('playlist-screen');
    screen.style.display = screen.style.display === 'flex' ? 'none' : 'flex';
  },

  changeColor(e) {
    if (e) e.stopPropagation();
    State.hue = (State.hue + 72) % 360;
    document.documentElement.style.setProperty('--hue', State.hue);
  },

  buildPlaylist() {
    const list = document.getElementById('track-list');
    list.innerHTML = '';
    playlist.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      item.innerText = songTitles[t] || t;
      item.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        Audio.loadTrack(i);
        this.togglePlaylist();
      });
      list.appendChild(item);
    });
  }
};

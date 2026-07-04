# MusicMoshiach

MusicMoshiach is a mobile-first, audio-reactive Three.js visualizer and PWA built for touch devices. It combines Web Audio FFT analysis, layered canvas rendering, and transparent 3D sphere visuals driven by the current track.

## Features

- Mobile-first, touch-driven interface.
- FFT-reactive 3D sphere visuals.
- Background image layer with full-opacity scene art.
- Transparent core sphere with see-through material.
- Playlist with named tracks.
- Offline support through a service worker.
- Installable PWA shell with root-level app icons.

## Repo Overview

This repository is built as a self-contained audio-visual instrument. The main app shell uses Three.js for the 3D foreground, a background image layer for atmosphere, and canvas overlays for waveform and pulse effects. Web Audio FFT analysis drives the motion, color response, and beat-reactive behavior so the visuals stay tied to the music instead of spinning constantly. The asset structure is organized around local audio tracks, background images, and core textures, with the manifest and service worker handling install and offline support.

## PWA Notes

- `manifest.json` defines the installable app shell and app icons.
- `sw.js` precaches the app shell and local assets for offline use.
- The app is designed to work offline after the first successful load.
- The service worker uses versioned caching so updates replace old assets cleanly.

## Controls

- Tap the screen to start.
- Tap again to trigger motion response.
- Play and pause audio from the HUD.
- Skip tracks with the next button.
- Open the playlist to jump to a track.
- Cycle visual modes with the mode button.
- Change the theme hue with the ghost button.

## Visual Design

The app uses a full-opacity background image layer, a transparent Three.js sphere, overlay canvases for waveform and pulse effects, and CSS HUD controls layered above the animation. The sphere is meant to feel see-through and living, while the background carries the larger visual mood. Motion is intentionally phrase-based and beat-aware rather than constant-spin.

## Offline Behavior

The service worker caches the HTML shell and local asset files. If a track, image, or texture path is incorrect, offline playback or visuals may fail, so filenames must match exactly. The root-level icons must also stay at the repo root so the manifest and service worker can reference them correctly.

## Notes

This project is tuned for mobile Chrome and touch-only interaction. It is intended to feel like a reactive audio instrument rather than a constant-spin visual toy.

# MusicMoshiach

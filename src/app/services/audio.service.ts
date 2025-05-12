import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {}

  loadSound(soundName: string, src: string): void {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.sounds[soundName] = audio;
  }

  playSound(soundName: string): void {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.volume = 0.5; // Adjust volume as needed
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.error(`Error playing sound ${soundName}:`, error);
      });
    } else {
      console.warn(`Sound ${soundName} not loaded.`);
    }
  }

  stopSound(soundName: string): void {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  cleanupSounds(): void {
    Object.keys(this.sounds).forEach((key) => {
      if (this.sounds[key]) {
        this.sounds[key].currentTime = 0;
        this.sounds[key].pause();
      }
    });
  }
}

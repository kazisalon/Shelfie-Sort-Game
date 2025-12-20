import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

/**
 * Professional Sound Manager with REAL Audio Files
 * Now playing actual MP3 sounds!
 */

class SoundManager {
    private static instance: SoundManager;
    private isMuted: boolean = false;
    private volume: number = 0.6;
    private loadedSounds: Map<string, Audio.Sound> = new Map();

    private constructor() {
        this.initAudio();
        this.preloadSounds();
    }

    static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private async initAudio() {
        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });
        } catch (error) {
            console.log('Audio init error:', error);
        }
    }

    /**
     * Preload all sounds for instant playback
     */
    private async preloadSounds() {
        try {
            // Load all sound files
            const soundFiles = {
                match: require('../../assets/sound-files/match.mp3'),
                drop: require('../../assets/sound-files/drop.mp3'),
                win: require('../../assets/sound-files/win.mp3'),
            };

            for (const [key, file] of Object.entries(soundFiles)) {
                try {
                    const { sound } = await Audio.Sound.createAsync(file, {
                        shouldPlay: false,
                        volume: this.volume,
                    });
                    this.loadedSounds.set(key, sound);
                    console.log(`✅ Loaded sound: ${key}`);
                } catch (error) {
                    console.log(`❌ Failed to load ${key}:`, error);
                }
            }
        } catch (error) {
            console.log('Sound preload error:', error);
        }
    }

    /**
     * Play professional game sounds + haptics
     */
    async playSound(type: 'pop' | 'match' | 'drop' | 'win' | 'whoosh') {
        console.log(`🔊 PLAYING SOUND: ${type}`); // DEBUG

        if (this.isMuted) {
            console.log(`🔇 Sound muted`);
            return;
        }

        try {
            // Play haptic feedback for instant response
            this.playHaptic(type);

            // Play audio sound
            const sound = this.loadedSounds.get(type);

            if (sound) {
                console.log(`✅ Found sound file for: ${type}`);
                // Replay from start
                await sound.setPositionAsync(0);
                await sound.playAsync();
                console.log(`🎵 Playing audio: ${type}`);
            } else {
                console.log(`⚠️ No sound file loaded for: ${type}`);
                if (type === 'pop' || type === 'whoosh') {
                    // For sounds we don't have files for, just use haptics
                    // You can add pop.mp3 and whoosh.mp3 later if needed
                }
            }
        } catch (error) {
            console.log(`❌ Sound play error (${type}):`, error);
        }
    }

    /**
     * Professional haptic feedback patterns
     */
    private playHaptic(type: string) {
        try {
            switch (type) {
                case 'pop':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    break;

                case 'drop':
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    break;

                case 'match':
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    break;

                case 'win':
                    // Double vibration for victory
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setTimeout(() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }, 150);
                    break;

                case 'whoosh':
                    Haptics.selectionAsync();
                    break;
            }
        } catch (error) {
            console.log('Haptic error:', error);
        }
    }

    /**
     * Toggle mute
     */
    toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    getMuteStatus(): boolean {
        return this.isMuted;
    }

    setVolume(vol: number) {
        this.volume = Math.max(0, Math.min(1, vol));
        // Update volume for all loaded sounds
        this.loadedSounds.forEach(async (sound) => {
            try {
                await sound.setVolumeAsync(this.volume);
            } catch (error) {
                console.log('Volume update error:', error);
            }
        });
    }

    /**
     * Cleanup on app close
     */
    async cleanup() {
        for (const [key, sound] of this.loadedSounds) {
            try {
                await sound.unloadAsync();
            } catch (error) {
                console.log(`Cleanup error for ${key}:`, error);
            }
        }
        this.loadedSounds.clear();
    }
}

export default SoundManager.getInstance();

import { Injectable, signal, effect } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const THEME_KEY = 'taskflow_theme';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    // Signal to track the current theme ('dark' | 'light')
    public isDarkMode = signal<boolean>(true);

    constructor() {
        this.initTheme();

        // Automatically apply the theme class to the HTML body whenever the signal changes
        effect(() => {
            const dark = this.isDarkMode();
            document.documentElement.classList.toggle('ion-palette-dark', dark);
            this.saveTheme(dark);
        });
    }

    private async initTheme() {
        const { value } = await Preferences.get({ key: THEME_KEY });
        if (value) {
            this.isDarkMode.set(value === 'dark');
        } else {
            // Default to dark mode if no preference is saved
            this.isDarkMode.set(true);
        }
    }

    private async saveTheme(isDark: boolean) {
        await Preferences.set({
            key: THEME_KEY,
            value: isDark ? 'dark' : 'light'
        });
    }

}
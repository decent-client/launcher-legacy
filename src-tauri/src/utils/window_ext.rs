use tauri::{
    window::{Effect, EffectsBuilder},
    Result, WebviewWindow,
};

#[cfg(target_os = "macos")]
use tauri::window::EffectState;

#[cfg(target_os = "windows")]
use windows_version::OsVersion;

pub trait WebviewWindowExt {
    fn apply_window_effects(&self) -> Result<&WebviewWindow>;
}

impl WebviewWindowExt for WebviewWindow {
    fn apply_window_effects(&self) -> Result<&WebviewWindow> {
        let mut effects = EffectsBuilder::new();

        #[cfg(target_os = "macos")]
        {
            effects = effects
                .effect(Effect::Popover)
                .state(EffectState::Active)
                .radius(16.0);
        }

        #[cfg(target_os = "windows")]
        {
            let version = OsVersion::current();

            if version.major > 10 || (version.major == 10 && version.minor >= 22000) {
                effects = effects.effect(Effect::Mica)
            } else if version.major == 10 {
                effects = effects.effect(Effect::Acrylic)
            } else {
                effects = effects.effect(Effect::Blur);
            }
        }

        #[cfg(target_os = "linux")]
        {
            effects = effects;
        }

        self.set_effects(effects.build())?;

        Ok(self)
    }
}

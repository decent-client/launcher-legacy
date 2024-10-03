use tauri::{window::EffectsBuilder, Result, WebviewWindow};

#[cfg(target_os = "macos")]
use tauri::window::{Effect, EffectState};

#[cfg(target_os = "windows")]
use tauri::window::Effect;
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

            effects = match version.major {
                11.. => effects.effect(Effect::Mica),
                10 if version.minor >= 22000 => effects.effect(Effect::Mica),
                10 => effects.effect(Effect::Acrylic),
                _ => effects,
            }
        }

        #[cfg(target_os = "linux")]
        {
            effects = effects;
        }

        let _win_effects = self.set_effects(effects.build()).map_err(|_err| {
            let mut fallback_effect = EffectsBuilder::new();

            #[cfg(target_os = "windows")]
            {
                fallback_effect = fallback_effect.effect(Effect::Blur);

                let _win_effects = self.set_effects(fallback_effect.build());
            }
        });

        Ok(self)
    }
}

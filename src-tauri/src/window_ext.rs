use tauri::{
    window::{Effect, EffectState, EffectsBuilder},
    WebviewWindow,
};
use windows_version::OsVersion;

pub fn apply_window_effects(window: &WebviewWindow) {
    #[cfg(target_os = "macos")]
    window
        .set_effects(
            EffectsBuilder::new()
                .effect(Effect::Popover)
                .state(EffectState::Active)
                .build(),
        )
        .unwrap();

    #[cfg(target_os = "windows")]
    {
        let version = OsVersion::current();

        if version.major > 10 {
            window
                .set_effects(
                    EffectsBuilder::new()
                        .effect(Effect::Mica)
                        .state(EffectState::Active)
                        .build(),
                )
                .unwrap();
        } else if version.major == 10 {
            window
                .set_effects(
                    EffectsBuilder::new()
                        .effect(Effect::Acrylic)
                        .state(EffectState::Active)
                        .build(),
                )
                .unwrap();
        } else {
            window
                .set_effects(
                    EffectsBuilder::new()
                        .effect(Effect::Blur)
                        .state(EffectState::Active)
                        .build(),
                )
                .unwrap();
        }
    }

    #[cfg(target_os = "linux")]
    window
        .set_background_color(Color::from_rgba(0, 0, 0, 200))
        .unwrap();
}

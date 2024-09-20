#[cfg(target_os = "macos")]
use tauri::{window::EffectState, Runtime};
use tauri::{
    window::{Effect, EffectsBuilder},
    WebviewWindow,
};
use windows_version::OsVersion;

pub fn apply_window_effects(window: &WebviewWindow) {
    let version = OsVersion::current();

    #[cfg(any(target_os = "macos", target_os = "windows"))]
    window
        .set_effects(
            #[cfg(target_os = "macos")]
            EffectsBuilder::new()
                .effect(Effect::Popover)
                .state(EffectState::Active)
                .build(),
            #[cfg(target_os = "windows")]
            {
                if version.major > 10 || (version.major == 10 && version.minor >= 22000) {
                    EffectsBuilder::new().effect(Effect::Mica).build()
                } else if version.major == 10 {
                    EffectsBuilder::new().effect(Effect::Acrylic).build()
                } else {
                    EffectsBuilder::new().effect(Effect::Blur).build()
                }
            },
        )
        .unwrap();

    #[cfg(target_os = "linux")]
    window
        .set_background_color(Color::from_rgba(0, 0, 0, 200))
        .unwrap();
}

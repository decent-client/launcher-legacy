use tauri::{
    //  Emitter, Error, Listener, Runtime,
    WebviewWindow,
};

#[cfg(target_os = "macos")]
use tauri::window::{Effect, EffectState, EffectsBuilder};

#[cfg(target_os = "windows")]
use tauri::window::{Effect, EffectsBuilder};
#[cfg(target_os = "windows")]
use windows_version::OsVersion;

// #[cfg(target_os = "macos")]
// #[macro_use]
// extern crate objc;

// pub trait WebviewWindowExt {
//     // #[cfg(target_os = "macos")]
//     fn set_traffic_lights_inset(&self, x: f32, y: f32) -> Result<&WebviewWindow, Error>;
//     // #[cfg(target_os = "macos")]
//     fn make_transparent(&self) -> Result<&WebviewWindow, Error>;
//     // #[cfg(target_os = "macos")]
//     fn set_window_level(&self, level: u32) -> Result<&WebviewWindow, Error>;
// }

pub fn apply_window_effects(window: &WebviewWindow) {
    #[cfg(target_os = "macos")]
    {
        let _ = window.set_effects(
            EffectsBuilder::new()
                .effect(Effect::Popover)
                .state(EffectState::Active)
                .build(),
        );
    }

    #[cfg(target_os = "windows")]
    {
        let version = OsVersion::current();
        let effects;

        if version.major > 10 || (version.major == 10 && version.minor >= 22000) {
            effects = EffectsBuilder::new().effect(Effect::Mica).build();
        } else if version.major == 10 {
            effects = EffectsBuilder::new().effect(Effect::Acrylic).build();
        } else {
            effects = EffectsBuilder::new().effect(Effect::Blur).build();
        }

        window.set_effects(effects).unwrap();
    }
}

// impl WebviewWindowExt for WebviewWindow {
//     #[cfg(target_os = "macos")]
//     fn set_traffic_lights_inset(&self, x: f32, y: f32) -> Result<&WebviewWindow, Error> {
//         ensure_main_thread(self, move |win| {
//             let ns_window = win.ns_window()?;
//             let ns_window_handle = traffic::UnsafeWindowHandle(ns_window);

//             traffic::position_traffic_lights(ns_window_handle, x.into(), y.into());

//             Ok(win)
//         })
//     }

//     #[cfg(target_os = "macos")]
//     fn make_transparent(&self) -> Result<&WebviewWindow, Error> {
//         use cocoa::{
//             appkit::NSColor,
//             base::{id, nil},
//             foundation::NSString,
//         };

//         self.with_webview(|webview| unsafe {
//             let id = webview.inner();
//             let no: id = msg_send![class!(NSNumber), numberWithBool:0];
//             let _: id =
//                 msg_send![id, setValue:no forKey: NSString::alloc(nil).init_str("drawsBackground")];
//         })?;

//         ensure_main_thread(self, move |win| {
//             let ns_win = win.ns_window()? as id;
//             unsafe {
//                 let win_bg_color =
//                     NSColor::colorWithSRGBRed_green_blue_alpha_(nil, 0.0, 0.0, 0.0, 0.0);
//                 let _: id = msg_send![ns_win, setBackgroundColor: win_bg_color];
//             }
//             Ok(win)
//         })
//     }

//     #[cfg(target_os = "macos")]
//     fn set_window_level(&self, level: u32) -> Result<&WebviewWindow, Error> {
//         ensure_main_thread(self, move |win| {
//             let ns_win = win.ns_window()? as cocoa::base::id;
//             unsafe {
//                 let _: () = msg_send![ns_win, setLevel: level];
//             }
//             Ok(win)
//         })
//     }
// }

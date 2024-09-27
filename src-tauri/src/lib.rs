use tauri::Manager;
use tauri_plugin_window_state::{AppHandleExt, StateFlags, WindowExt};
use utils::window_ext::WebviewWindowExt;

#[cfg(target_os = "macos")]
use tauri_plugin_decorum::WebviewWindowExt;

mod commands;
mod utils;

pub fn run() {
    let state_flags = StateFlags::POSITION | StateFlags::SIZE | StateFlags::MAXIMIZED;

    tauri::Builder::default()
        .setup(move |app| {
            let splash_window = app.get_webview_window("splash-screen").unwrap();

            splash_window.set_focus().unwrap();

            for window_name in ["splash-screen", "main-launcher"] {
                if let Some(window) = app.get_webview_window(window_name) {
                    let _win_state = window.restore_state(state_flags);
                    let _win_effect = window.apply_window_effects();

                    #[cfg(target_os = "macos")]
                    {
                        window.set_traffic_lights_inset(12.0, 16.0).unwrap();
                        window.make_transparent().unwrap();
                    }
                }
            }

            utils::tray::create_tray(app.handle())?;

            Ok(())
        })
        .on_window_event(move |window, event| match event {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                let app = window.app_handle();
                app.save_window_state(state_flags).ok();

                if window.label() == "main-launcher" {
                    window.hide().unwrap();
                    api.prevent_close();
                }
            }
            _ => {}
        })
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main-launcher") {
                window.show().unwrap();
                window.set_focus().unwrap();
            }
        }))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_system_info::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_decorum::init())
        .invoke_handler(tauri::generate_handler![
            commands::window::setup_windows,
            commands::window::show_snap_overlay,
            commands::texture::get_player_face,
            commands::texture::get_player_texture,
            commands::auth::setup_auth,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

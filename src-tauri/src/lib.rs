use tauri::Manager;

mod commands;
mod window_ext;

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            for window_name in ["splash-screen", "main-launcher"] {
                if let Some(window) = app.get_webview_window(window_name) {
                    window_ext::apply_window_effects(&window);
                }
            }
            Ok(())
        })
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_system_info::init())
        .invoke_handler(tauri::generate_handler![
            commands::setup_windows,
            commands::show_snap_overlay,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

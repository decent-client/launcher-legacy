mod commands;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_system_info::init())
        .invoke_handler(tauri::generate_handler![
            commands::setup_windows,
            commands::show_snap_overlay,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

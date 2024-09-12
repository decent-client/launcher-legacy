use tauri::Manager;

#[tauri::command(rename_all = "snake_case")]
fn setup_windows(app_handle: tauri::AppHandle) {
    let splash_window = app_handle.get_webview_window("splash-screen").unwrap();
    let main_window = app_handle.get_webview_window("main-launcher").unwrap();

    splash_window.close().unwrap();
    main_window.show().unwrap();
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_system_info::init())
        .invoke_handler(tauri::generate_handler![setup_windows])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

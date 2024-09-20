use tauri::Manager;

#[tauri::command]
pub fn setup_windows(app_handle: tauri::AppHandle) {
    let splash_window = app_handle.get_webview_window("splash-screen").unwrap();
    let main_window = app_handle.get_webview_window("main-launcher").unwrap();

    splash_window.close().unwrap();
    main_window.show().unwrap();
    main_window.set_focus().unwrap();
}

#[tauri::command]
pub async fn show_snap_overlay() {
    #[cfg(target_os = "windows")]
    {
        use enigo::{Enigo, Key, KeyboardControllable};

        let mut enigo = Enigo::new();
        enigo.key_down(Key::Meta);
        enigo.key_click(Key::Layout('z'));
        enigo.key_up(Key::Meta);

        std::thread::sleep(std::time::Duration::from_millis(50));

        enigo.key_click(Key::Alt);
    }
}

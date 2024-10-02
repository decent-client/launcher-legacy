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
        use enigo::{
            Direction::{Click, Press, Release},
            Enigo, Key, Keyboard, Settings,
        };

        let mut enigo = Enigo::new(&Settings::default()).unwrap();

        enigo.key(Key::Meta, Press).unwrap();
        enigo.key(Key::Z, Click).unwrap();
        enigo.key(Key::Meta, Release).unwrap();

        std::thread::sleep(std::time::Duration::from_millis(50));

        enigo.key(Key::Alt, Click).unwrap();
    }
}

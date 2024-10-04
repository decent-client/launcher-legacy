use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Result, Runtime,
};

pub fn create_tray<R: Runtime>(app: &AppHandle<R>) -> Result<()> {
    let _ = TrayIconBuilder::with_id("tray")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&Menu::with_items(
            app,
            &[
                &MenuItem::with_id(app, "home", "Launcher", true, None::<&str>)?,
                &MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?,
                &MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?,
            ],
        )?)
        .menu_on_left_click(false)
        .on_menu_event(move |app, event| match event.id.as_ref() {
            "home" => {
                view_webview_window(app, "main-launcher", Some("/launcher"));
            }

            "settings" => {
                view_webview_window(app, "main-launcher", Some("/launcher/settings"));
            }

            "quit" => {
                app.exit(0);
            }

            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main-launcher") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app);

    Ok(())
}

fn view_webview_window<R: Runtime>(app: &AppHandle<R>, label: &str, path: Option<&str>) {
    if let Some(mut window) = app.get_webview_window(label) {
        window.show().unwrap();
        window.set_focus().unwrap();

        if let Some(p) = path {
            window
                .navigate(window.url().unwrap().join(p).expect("Parse Url path"))
                .unwrap();
        }
    }
}

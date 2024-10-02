use minecraft_essentials::{CustomAuthData, Oauth};
use tauri::{AppHandle, Url, WebviewWindowBuilder};

#[tauri::command(rename_all = "snake_case")]
pub async fn setup_auth(app_handle: tauri::AppHandle) -> Result<CustomAuthData, String> {
    handle_auth(app_handle, 8000)
        .await
        .map_err(|e| e.to_string())
}

async fn handle_auth(
    app_handle: AppHandle,
    port: u16,
) -> Result<CustomAuthData, Box<dyn std::error::Error>> {
    let auth = Oauth::new("f7770de8-077a-46ea-9604-908154eee29b", Some(port));
    let window_url = Url::parse(auth.url()).expect("Failed to parse URL");

    let _auth_window = WebviewWindowBuilder::new(
        &app_handle,
        "microsoft-auth",
        tauri::WebviewUrl::External(window_url),
    )
    .title("Decent Client - Authentication")
    .inner_size(465.0, 600.0)
    .center()
    .build();

    let auth_info = auth
        .launch(false, "ruV8Q~~6mzJVC9JczwO-hwnCOmY7reCYDQqY.c9D")
        .await?;

    Ok(auth_info)
}

use minecraft_essentials::{CustomAuthData, Oauth};
use tauri::{AppHandle, Url, WebviewUrl, WebviewWindowBuilder};

#[tauri::command(rename_all = "snake_case")]
pub async fn setup_auth(app_handle: AppHandle) -> Result<CustomAuthData, String> {
    handle_auth(app_handle)
        .await
        .map_err(|error| error.to_string())
}

async fn handle_auth(app_handle: AppHandle) -> Result<CustomAuthData, Box<dyn std::error::Error>> {
    let auth = Oauth::new("f7770de8-077a-46ea-9604-908154eee29b", None);
    let window_url = Url::parse(auth.url()).expect("Expected an Url");

    println!("{}", &window_url);

    let auth_window = WebviewWindowBuilder::new(
        &app_handle,
        "microsoft-auth",
        WebviewUrl::External(window_url),
    )
    .title("Decent Client - Authentication")
    .inner_size(465.0, 600.0)
    .center()
    .build();

    let auth_data = auth
        .launch(false, "ruV8Q~~6mzJVC9JczwO-hwnCOmY7reCYDQqY.c9D")
        .await?;

    auth_window.unwrap().destroy().unwrap();

    Ok(auth_data)
}

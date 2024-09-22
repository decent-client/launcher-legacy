use minecraft_msa_auth::MinecraftAuthorizationFlow;
use oauth2::basic::BasicClient;
use oauth2::reqwest::async_http_client;
use oauth2::{
    AuthType, AuthUrl, AuthorizationCode, ClientId, CsrfToken, PkceCodeChallenge, RedirectUrl,
    Scope, TokenResponse, TokenUrl,
};
use reqwest::{Client, Url};
use tauri::WebviewWindowBuilder;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpListener;

const MSA_AUTHORIZE_URL: &str = "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize";
const MSA_TOKEN_URL: &str = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

#[tauri::command(rename_all = "snake_case")]
pub async fn setup_auth(app_handle: tauri::AppHandle) {
    println!("attempting to authenticate with microsoft");

    tokio::spawn(async move {
        if let Err(e) = init_auth(app_handle).await {
            eprintln!("microsoft auth failed: {:?}", e);
        }
    });
}

async fn init_auth(app_handle: tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let client = BasicClient::new(
        ClientId::new("f7770de8-077a-46ea-9604-908154eee29b".to_string()),
        None,
        // Some(ClientSecret::new(
        // )),
        AuthUrl::new(MSA_AUTHORIZE_URL.to_string()).unwrap(),
        Some(TokenUrl::new(MSA_TOKEN_URL.to_string()).unwrap()),
    )
    .set_auth_type(AuthType::RequestBody)
    .set_redirect_uri(
        RedirectUrl::new("http://localhost:8114/redirect".to_string())
            .expect("Invalid redirect URL"),
    );

    let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    let (authorize_url, csrf_state) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("XboxLive.signin offline_access".to_string()))
        .set_pkce_challenge(pkce_code_challenge)
        .url();

    let _ = WebviewWindowBuilder::new(
        &app_handle,
        "microsoft-auth",
        tauri::WebviewUrl::External(authorize_url),
    )
    .title("Microsoft Authentication")
    .inner_size(465.0, 600.0)
    .center()
    .build();

    let listener = TcpListener::bind("127.0.0.1:8114").await?;
    loop {
        let (stream, _) = listener.accept().await?;
        stream.readable().await?;
        let mut stream = BufReader::new(stream);

        let code;
        let state;
        {
            let mut request_line = String::new();
            stream.read_line(&mut request_line).await?;

            let redirect_url = request_line.split_whitespace().nth(1).unwrap();
            let url = Url::parse(&("http://localhost".to_string() + redirect_url))?;

            let (_key, value) = url
                .query_pairs()
                .find(|(key, _value)| key == "code")
                .unwrap();
            code = AuthorizationCode::new(value.into_owned());

            let (_key, value) = url
                .query_pairs()
                .find(|(key, _value)| key == "state")
                .unwrap();
            state = CsrfToken::new(value.into_owned());
        }

        let message = "Go back to your terminal :)";
        let response = format!(
            "HTTP/1.1 200 OK\r\ncontent-length: {}\r\n\r\n{}",
            message.len(),
            message
        );
        stream.write_all(response.as_bytes()).await?;

        println!("MS returned the following code:\n{}\n", code.secret());
        println!(
            "MS returned the following state:\n{} (expected `{}`)\n",
            state.secret(),
            csrf_state.secret()
        );

        // Exchange the code with a token.
        let token = client
            .exchange_code(code)
            // Send the PKCE code verifier in the token request
            .set_pkce_verifier(pkce_code_verifier)
            .request_async(async_http_client)
            .await?;
        println!("microsoft token:\n{:?}\n", token);

        // Exchange the Microsoft token with a Minecraft token.
        let mc_flow = MinecraftAuthorizationFlow::new(Client::new());
        let mc_token = mc_flow
            .exchange_microsoft_token(token.access_token().secret())
            .await?;
        println!("minecraft token: {:?}", mc_token);

        let x = mc_token.access_token().as_ref();
        println!("minecraft token: {:?}", x);

        // let res = Client::new()
        //     .get("https://api.minecraftservices.com/minecraft/profile")
        //     .header("Authorization", format!("Bearer {}", x))
        //     .header("Accept", "application/json")
        //     .send()
        //     .await?;

        // println!("{:?}", res);

        // let res = res.text().await?;
        // println!("{:?}", res);

        // The server will terminate itself after collecting the first code.
        break;
    }

    Ok(())
}

// fn get_client_id() -> String {
//     std::env::var("AZURE_CLIENT_ID").unwrap_or_else(|_| {
//         eprintln!("AZURE_CLIENT_ID not set");
//         std::process::exit(1);
//     })
// }

// fn get_client_secret() -> String {
//     std::env::var("AZURE_CLIENT_SECRET").unwrap_or_else(|_| {
//         eprintln!("AZURE_CLIENT_SECRET not set");
//         std::process::exit(1);
//     })
// }

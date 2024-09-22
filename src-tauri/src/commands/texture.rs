use base64::{engine::general_purpose, Engine as _};
use image::GenericImageView;
use reqwest;
use std::io::Cursor;

#[tauri::command(rename_all = "camelCase")]
pub async fn get_player_face(player_name: String) -> Result<String, String> {
    // Fetch UUID from Mojang API
    let uuid_url = format!(
        "https://api.mojang.com/users/profiles/minecraft/{}",
        player_name
    );
    let uuid_response = reqwest::get(&uuid_url).await.map_err(|e| e.to_string())?;
    let uuid_json: serde_json::Value = uuid_response.json().await.map_err(|e| e.to_string())?;
    let uuid = uuid_json["id"].as_str().ok_or("Failed to get UUID")?;

    // Fetch skin URL from Mojang API
    let profile_url = format!(
        "https://sessionserver.mojang.com/session/minecraft/profile/{}",
        uuid
    );
    let profile_response = reqwest::get(&profile_url)
        .await
        .map_err(|e| e.to_string())?;
    let profile_json: serde_json::Value =
        profile_response.json().await.map_err(|e| e.to_string())?;
    let texture_property = profile_json["properties"]
        .as_array()
        .and_then(|props| props.iter().find(|p| p["name"] == "textures"))
        .ok_or("Texture property not found")?;
    let texture_base64 = texture_property["value"]
        .as_str()
        .ok_or("Texture value not found")?;
    let texture_json: serde_json::Value = serde_json::from_slice(
        &general_purpose::STANDARD
            .decode(texture_base64)
            .map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;
    let skin_url = texture_json["textures"]["SKIN"]["url"]
        .as_str()
        .ok_or("Skin URL not found")?;

    // Download skin image
    let skin_bytes = reqwest::get(skin_url)
        .await
        .map_err(|e| e.to_string())?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;
    let skin_image = image::load_from_memory(&skin_bytes).map_err(|e| e.to_string())?;

    // Extract face (8x8 pixels from 8,8 to 16,16)
    let face = skin_image.crop_imm(8, 8, 8, 8);

    // Extract second layer (8x8 pixels from 40,8 to 48,16)
    let face_overlay = skin_image.crop_imm(40, 8, 8, 8);

    // Scale up the face and overlay to 64x64
    let scaled_face = face.resize(64, 64, image::imageops::FilterType::Nearest);
    let scaled_overlay = face_overlay.resize(64, 64, image::imageops::FilterType::Nearest);

    // Combine base face and overlay
    let mut combined_face = scaled_face.to_rgba8();
    for (x, y, pixel) in scaled_overlay.pixels() {
        if pixel[3] != 0 {
            // If the overlay pixel is not transparent
            combined_face.put_pixel(x, y, pixel);
        }
    }

    // Convert to base64
    let mut buffer = Vec::new();
    combined_face
        .write_to(&mut Cursor::new(&mut buffer), image::ImageOutputFormat::Png)
        .map_err(|e| e.to_string())?;
    let base64_image = general_purpose::STANDARD.encode(&buffer);

    Ok(format!("data:image/png;base64,{}", base64_image))
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_player_texture(player_name: String) -> Result<String, String> {
    // Fetch UUID from Mojang API
    let uuid_url = format!(
        "https://api.mojang.com/users/profiles/minecraft/{}",
        player_name
    );
    let uuid_response = reqwest::get(&uuid_url).await.map_err(|e| e.to_string())?;
    let uuid_json: serde_json::Value = uuid_response.json().await.map_err(|e| e.to_string())?;
    let uuid = uuid_json["id"].as_str().ok_or("Failed to get UUID")?;

    // Fetch skin URL from Mojang API
    let profile_url = format!(
        "https://sessionserver.mojang.com/session/minecraft/profile/{}",
        uuid
    );
    let profile_response = reqwest::get(&profile_url)
        .await
        .map_err(|e| e.to_string())?;
    let profile_json: serde_json::Value =
        profile_response.json().await.map_err(|e| e.to_string())?;
    let texture_property = profile_json["properties"]
        .as_array()
        .and_then(|props| props.iter().find(|p| p["name"] == "textures"))
        .ok_or("Texture property not found")?;
    let texture_base64 = texture_property["value"]
        .as_str()
        .ok_or("Texture value not found")?;
    let texture_json: serde_json::Value = serde_json::from_slice(
        &general_purpose::STANDARD
            .decode(texture_base64)
            .map_err(|e| e.to_string())?,
    )
    .map_err(|e| e.to_string())?;
    let skin_url = texture_json["textures"]["SKIN"]["url"]
        .as_str()
        .ok_or("Skin URL not found")?;

    // Download skin image
    let skin_bytes = reqwest::get(skin_url)
        .await
        .map_err(|e| e.to_string())?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;

    // Convert to base64
    let base64_image = general_purpose::STANDARD.encode(&skin_bytes);

    Ok(format!("data:image/png;base64,{}", base64_image))
}

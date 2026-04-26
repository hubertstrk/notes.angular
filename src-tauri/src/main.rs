// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::json;

#[tauri::command]
async fn llm_summarize(text: String) -> Result<String, String> {

    const prompt: &str = "Format Note into professional markdown. Use emojis where appropriate.
    Take your best guess at formatting, structure, and organization.
    Use headings, bullet points, and other markdown features to make the note clear and easy to read.
    If you have several ideas for how to format the note, choose the one you think is best.";

    let client = reqwest::Client::new();
    let body = json!({
        "model": "local-model",
        "messages": [
            { "role": "user", "content": format!("{}\n\n--- Note Content ---\n{}", prompt, text) }
        ],
        "temperature": 0.2,
        "max_tokens": 5000
    });

    let response = client
        .post("http://localhost:1234/v1/chat/completions")
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    let summary = json["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("Failed to get summary.")
        .to_string();

    Ok(summary)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![llm_summarize])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

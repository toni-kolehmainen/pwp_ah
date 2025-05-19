// Utility functions and types for API communication (base URL, root links, etc.)

use dotenv::dotenv;
use std::env;

use serde::Deserialize;
use std::collections::HashMap;

// Struct for deserializing API root _links
#[derive(Debug, Deserialize)]
pub struct ApiRootLinks {
    #[serde(rename = "_links")]
    pub links: HashMap<String, ApiLink>,
}

// Struct for a single API link (href and method)
#[derive(Debug, Deserialize)]
pub struct ApiLink {
    pub href: String,
    pub method: Option<String>,
}

// Get the API base URL from environment or use default
pub async fn get_base_url() -> String {
    dotenv().ok();
    env::var("BASE_URL").unwrap_or_else(|_| "http://172.201.17.30:8080/api".to_string())
}

// Get the server address (without /api)
pub async fn get_address() -> String {
    "http://172.201.17.30:8080".to_string()
}

// Fetch the API root _links as a HashMap (only GET methods)
pub async fn fetch_api_root_links() -> Option<HashMap<String, ApiLink>> {
    let base_url = get_base_url().await;
    let url = base_url.trim_end_matches('/').to_string();
    if let Ok(resp) = reqwest::get(&url).await {
        if let Ok(json) = resp.json::<serde_json::Value>().await {
            if let Some(links) = json.get("_links") {
                if let Some(map) = links.as_object() {
                    return Some(
                        map.iter()
                            .filter_map(|(k, v)| {
                                let method = v.get("method").and_then(|m| m.as_str()).map(|s| s.to_string());
                                if method.as_deref().unwrap_or("GET") == "GET" {
                                    let href = v.get("href")?.as_str()?.to_string();
                                    Some((k.clone(), ApiLink { href, method }))
                                } else {
                                    None
                                }
                            })
                            .collect(),
                    );
                }
            } else {
                eprintln!("No _links found at {}. Body: {}", url, json);
            }
        }
    }
    None
}

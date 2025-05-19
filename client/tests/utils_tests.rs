use auction_cli::api::utils::*;
use std::env;

#[tokio::test]
async fn test_get_base_url_default() {
    env::remove_var("BASE_URL");
    let url = get_base_url().await;
    assert!(url.starts_with("http://"));
}

#[tokio::test]
async fn test_get_base_url_env() {
    env::set_var("BASE_URL", "http://localhost:1234/api");
    let url = get_base_url().await;
    assert_eq!(url, "http://localhost:1234/api");
}

#[tokio::test]
async fn test_get_address() {
    let addr = get_address().await;
    assert!(addr.starts_with("http://"));
}

#[tokio::test]
async fn test_fetch_api_root_links_none() {
    // Should return None if server is unreachable or _links missing
    env::set_var("BASE_URL", "http://127.0.0.1:59999/api");
    let links = fetch_api_root_links().await;
    assert!(links.is_none());
}

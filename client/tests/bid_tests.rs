use auction_cli::api::bids::*;
use reqwest::Client;

#[tokio::test]
async fn test_fetch_bids_ok() {
    let client = Client::new();
    let result = fetch_bids(&client).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_fetch_bid_by_id() {
    let client = Client::new();
    let id = 1;
    let result = fetch_bid(&client, id).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_delete_bid_invalid_id() {
    let client = Client::new();
    let id = 999999;
    let result = delete_bid(&client, id).await;
    assert!(result.is_ok());
}

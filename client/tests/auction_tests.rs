use auction_cli::api::auctions::*;
use reqwest::Client;

#[tokio::test]
async fn test_fetch_auctions_ok() {
    let client = Client::new();
    let result = fetch_auctions(&client).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_fetch_auction_by_id() {
    let client = Client::new();
    let result = fetch_auction(&client, 1).await;
    assert!(result.is_ok());
}

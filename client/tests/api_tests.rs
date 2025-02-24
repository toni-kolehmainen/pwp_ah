use auction_cli::api::fetch_users;
use reqwest::Client;

#[tokio::test]
async fn test_fetch_users_integration() {
    let client = Client::new();
    let result = fetch_users(&client).await;
    assert!(
        result.is_err(),
        "Expected an error when fetching users from an invalid URL"
    );
}

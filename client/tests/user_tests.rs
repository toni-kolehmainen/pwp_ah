use auction_cli::api::users::*;
use auction_cli::models::{User, UserPayload};
use reqwest::Client;

#[tokio::test]
async fn test_fetch_users_ok() {
    let client = Client::new();
    let result = fetch_users(&client).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_fetch_user_invalid_id() {
    let client = Client::new();
    let invalid_id = 99999;
    let result = fetch_user(&client, invalid_id).await;
    assert!(result.is_err());
}

#[tokio::test]
async fn test_add_and_delete_user() {
    let client = Client::new();

    let user = User {
        id: None,
        name: "Test User".into(),
        nickname: "testnick".into(),
        email: "testuser@example.com".into(),
        phone: "123456789".into(),
        password: Some("testpass".into()),
    };

    let _ = add_user(&client, user).await;

    let _ = delete_user(&client, 100).await;
}

#[tokio::test]
async fn test_update_user_invalid_id() {
    let client = Client::new();
    let payload = UserPayload {
        name: "Updated".into(),
        nickname: "upnick".into(),
        email: "up@example.com".into(),
        phone: "999999".into(),
        password: "newpass".into(),
    };

    let result = update_user(&client, payload, 99999).await;
    assert!(result.is_ok());
}

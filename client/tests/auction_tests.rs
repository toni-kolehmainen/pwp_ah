use auction_cli::api::auctions::*;
use auction_cli::models::auctions::{AuctionPayload};
use reqwest::Client;
use httpmock::prelude::*;
use std::fs;

#[tokio::test]
async fn test_fetch_auctions_ok() {
    let server = MockServer::start();
    let mock_body = r#"{
        "_embedded": {
            "auctions": [
                {
                    "_links": {
                        "self": { "href": "/auctions/1", "method": "GET" },
                        "edit": { "href": "/auctions/1", "method": "PUT" },
                        "delete": { "href": "/auctions/1", "method": "DELETE" }
                    },
                    "id": 1,
                    "description": "Auction 1",
                    "item_id": 1,
                    "seller_id": 1,
                    "start_time": "2024-01-01T00:00:00Z",
                    "end_time": "2024-12-31T23:59:59Z",
                    "starting_price": "100.0",
                    "current_price": "150.0"
                }
            ]
        }
    }"#;
    let _m = server.mock(|when, then| {
        when.method(GET).path("/auctions");
        then.status(200)
            .header("content-type", "application/json")
            .body(mock_body);
    });

    // Patch get_base_url to return mock server url
    std::env::set_var("API_BASE_URL", server.url(""));
    let client = Client::new();
    let result = fetch_auctions(&client).await;
    assert!(result.is_ok());
}
/* 
#[tokio::test]
async fn test_fetch_auction_by_id_ok() {
    let server = MockServer::start();
    let mock_body = r#"{
        "_links": {
            "self": { "href": "/auctions/3", "method": "GET" },
            "edit": { "href": "/auctions/3", "method": "PUT" },
            "delete": { "href": "/auctions/3", "method": "DELETE" }
        },
        "id": 3,
        "description": "Auction 3",
        "item_id": 3,
        "seller_id": 3,
        "start_time": "2024-01-01T00:00:00Z",
        "end_time": "2024-12-31T23:59:59Z",
        "starting_price": "100.0",
        "current_price": "150.0"
    }"#;
    let _m = server.mock(|when, then| {
        when.method(GET).path("/auctions/3");
        then.status(200)
            .header("content-type", "application/json")
            .body(mock_body);
    });

    std::env::set_var("API_BASE_URL", server.url(""));
    let client = Client::new();
    let result = fetch_auction(&client, 3).await;
    assert!(result.is_ok());
}
*/
#[tokio::test]
async fn test_create_auction_ok() {
    let server = MockServer::start();
    let mock_body = r#"{
        "_links": {
            "self": { "href": "/auctions/1", "method": "GET" }
        },
        "id": 1,
        "description": "Auction 1",
        "item_id": 1,
        "seller_id": 1,
        "start_time": "2024-01-01T00:00:00Z",
        "end_time": "2024-12-31T23:59:59Z",
        "starting_price": "100.0",
        "current_price": "100.0"
    }"#;
    let _m = server.mock(|when, then| {
        when.method(POST).path("/auctions");
        then.status(201)
            .header("content-type", "application/json")
            .body(mock_body);
    });

    std::env::set_var("API_BASE_URL", server.url(""));
    // Write a fake token file for auth
    fs::write(".auth_token", "testtoken").unwrap();

    let client = Client::new();
    let payload = AuctionPayload {
        item_id: 1,
        description: "Auction 1".to_string(),
        starting_price: 100.0,
        end_time: "2024-12-31T23:59:59Z".to_string(),
    };
    let result = create_auction(&client, payload).await;
    assert!(result.is_ok());
    let _ = fs::remove_file(".auth_token");
}

#[tokio::test]
async fn test_delete_auction_ok() {
    let server = MockServer::start();
    let _m = server.mock(|when, then| {
        when.method(DELETE).path("/auctions/1");
        then.status(200).body("Auction 1 deleted successfully");
    });

    std::env::set_var("API_BASE_URL", server.url(""));
    fs::write(".auth_token", "testtoken").unwrap();

    let client = Client::new();
    let result = delete_auction(&client, 1).await;
    assert!(result.is_ok());
    let _ = fs::remove_file(".auth_token");
}

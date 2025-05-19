// tests/item_tests.rs

use auction_cli::api::items::*;
use auction_cli::api::utils::get_base_url;
use auction_cli::models::{HalItemResponse2, Item2, ItemPayload2};
use reqwest::Client;


#[tokio::test]
async fn test_add_update_delete_item() {
    let client = Client::new();

    let item = ItemPayload2 {
        name: "Test Item".to_string(),
        description: "This is a test item".to_string(),
        userId: 1,
        categoryId: 1,
    };
    let result = add_item(&client, item).await;
    assert!(result.is_ok());

    let item_id = 1;

    let payload = ItemPayload2 {
        name: "Updated Item".to_string(),
        description: "Updated description".to_string(),
        userId: 1,
        categoryId: 1,
    };
    let update_result = update_item(&client, payload, &item_id).await;
    assert!(update_result.is_ok());

    let delete_result = delete_item(&client, &item_id).await;
    assert!(delete_result.is_ok());
}

// tests/item_tests.rs

use auction_cli::api::items::*;
use auction_cli::api::utils::get_base_url;
use auction_cli::models::{HalItemResponse2, Item, ItemPayload};
use reqwest::Client;

#[tokio::test]
async fn test_fetch_items_ok() {
    let client = Client::new();
    let result = fetch_items(&client).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_fetch_created_item() {
    let client = Client::new();

    let new_item = Item {
        id: None,
        name: "TempTestItem".to_string(),
        description: "Created in test".to_string(),
        userId: 1,
        categoryId: 1,
    };

    let _ = add_item(&client, new_item.clone()).await;

    let base_url = get_base_url().await;
    let url = format!("{}/items", base_url);
    let hal: HalItemResponse2 = client.get(url).send().await.unwrap().json().await.unwrap();

    let created = hal.embedded.items.iter().find(|wrapper| {
        wrapper.dataValues.name == new_item.name
            && wrapper.dataValues.description == new_item.description
    });

    assert!(created.is_some());
    let id = created.unwrap().dataValues.id.unwrap();

    let result = fetch_item(&client, &id).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_add_update_delete_item() {
    let client = Client::new();

    let item = Item {
        id: None,
        name: "Test Item".to_string(),
        description: "This is a test item".to_string(),
        userId: 1,
        categoryId: 1,
    };
    let result = add_item(&client, item).await;
    assert!(result.is_ok());

    let item_id = 1;

    let payload = ItemPayload {
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

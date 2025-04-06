use auction_cli::api::categories::*;
use auction_cli::models::Category;
use reqwest::Client;

#[tokio::test]
async fn test_fetch_categories() {
    let client = Client::new();
    let result = fetch_categories(&client).await;
    assert!(result.is_ok(), "Failed to fetch categories");
}

#[tokio::test]
async fn test_add_and_fetch_category() {
    let client = Client::new();

    let new_category = Category {
        id: None,
        name: "Test Category".to_string(),
        description: "Temporary category for testing".to_string(),
    };

    let add_result = add_category(&client, new_category.clone()).await;
    assert!(add_result.is_ok(), "Failed to add category");

    let fetch_result = fetch_categories(&client).await;
    assert!(fetch_result.is_ok(), "Failed to fetch after adding");
}

#[tokio::test]
async fn test_delete_category_invalid_id() {
    let client = Client::new();

    let result = delete_category(&client, 99999).await;
    assert!(
        result.is_ok(),
        "Expected graceful error for deleting non-existing category"
    );
}

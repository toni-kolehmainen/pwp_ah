use auction_cli::api::categories::*;
use auction_cli::models::Category;
use reqwest::Client;
use httpmock::prelude::*;

#[tokio::test]
async fn test_add_category_ok() {
    let server = MockServer::start();
    let _m = server.mock(|when, then| {
        when.method(POST).path("/categories");
        then.status(201)
            .header("content-type", "application/json")
            .body("{}");
    });
    std::env::set_var("BASE_URL", server.url(""));
    let client = Client::new();
    let cat = Category {
        id: None,
        name: "TestCat".to_string(),
        description: "desc".to_string(),
    };
    let result = add_category(&client, cat).await;
    assert!(result.is_ok());
}

#[tokio::test]
async fn test_delete_category_ok() {
    let server = MockServer::start();
    let _m = server.mock(|when, then| {
        when.method(DELETE).path("/categories/1");
        then.status(200).body("deleted");
    });
    std::env::set_var("BASE_URL", server.url(""));
    let client = Client::new();
    let result = delete_category(&client, 1).await;
    assert!(result.is_ok());
}

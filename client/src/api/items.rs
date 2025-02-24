use crate::models::Item;
use reqwest::Client;
use std::error::Error;

pub async fn fetch_items(client: &Client) -> Result<(), Box<dyn Error>> {
    let items: Vec<Item> = client
        .get("https://api.example.com/items")
        .send()
        .await?
        .json()
        .await?;
    for item in items {
        println!(
            "Name: {}, Description: {}, Category ID: {}",
            item.name, item.description, item.category_id
        );
    }
    Ok(())
}

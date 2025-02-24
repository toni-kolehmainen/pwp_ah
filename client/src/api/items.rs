use crate::api::utils::get_base_url;
use crate::models::Item;
use reqwest::{header, Client};
use std::error::Error;

pub async fn fetch_items(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items", base_url);
    let items: Vec<Item> = client.get(url).send().await?.json().await?;
    for item in items {
        println!(
            "Name: {}, Description: {}, Category ID: {}, User_ID: {}",
            item.name, item.description, item.categoryId, item.userId
        );
    }
    Ok(())
}

pub async fn add_item(client: &Client, item: Item) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/categories", base_url);

    let response = client
        .post(&url)
        .json(&item)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    if response.status().is_success() {
        let created_item: Item = response.json().await?;
        println!(
            "Created item - Name: {}, Description: {}",
            created_item.name, created_item.description
        );
    } else {
        eprintln!("Failed to create item: {}", response.status());
    }

    Ok(())
}

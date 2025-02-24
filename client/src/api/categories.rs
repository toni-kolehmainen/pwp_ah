use crate::models::Category;
use reqwest::Client;
use std::error::Error;

pub async fn fetch_categories(client: &Client) -> Result<(), Box<dyn Error>> {
    let categories: Vec<Category> = client
        .get("https://api.example.com/categories")
        .send()
        .await?
        .json()
        .await?;
    for category in categories {
        println!(
            "Name: {}, Description: {}",
            category.name, category.description
        );
    }
    Ok(())
}

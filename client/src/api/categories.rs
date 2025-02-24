use crate::api::utils::get_base_url;
use crate::models::Category;
use reqwest::{header, Client};
use std::error::Error;

pub async fn fetch_categories(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await; // Get the base URL once
    let url = format!("{}/categories", base_url); // Append endpoint
    let categories: Vec<Category> = client.get(url).send().await?.json().await?;
    for category in categories {
        println!(
            "Name: {}, Description: {}",
            category.name, category.description
        );
    }
    Ok(())
}

pub async fn add_category(
    client: &Client,
    name: String,
    description: String,
) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/categories", base_url);

    let category = Category { name, description };

    let response = client
        .post(&url)
        .json(&category)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    if response.status().is_success() {
        let created_category: Category = response.json().await?;
        println!(
            "Created Category - Name: {}, Description: {}",
            created_category.name, created_category.description
        );
    } else {
        eprintln!("Failed to create category: {}", response.status());
    }

    Ok(())
}

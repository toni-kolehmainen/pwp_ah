// API client functions for interacting with the categories endpoints.

use crate::api::utils::get_base_url;
use crate::models::{Category, HalCategoryResponse};
use reqwest::{header, Client};
use std::error::Error;

// Fetch all categories and print their details
pub async fn fetch_categories(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/categories", base_url);
    let resp = client.get(url).send().await?;
    let status = resp.status();
    let text = resp.text().await?;
    
    let hal: Result<HalCategoryResponse, _> = serde_json::from_str(&text);
    match hal {
        Ok(hal) => {
            for wrapper in hal.embedded.items {
                let category = &wrapper.category;
                println!(
                    "ID: {}, Name: {}, Description: {}",
                    category.id.unwrap_or_default(),
                    category.name,
                    category.description
                );
            }
        }
        Err(e) => {
            eprintln!("fetch_categories error: {e}");
            eprintln!("Raw response: {text}");
            return Err(Box::new(e));
        }
    }
    Ok(())
}

// Create a new category using the provided payload
pub async fn add_category(client: &Client, category: Category) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/categories", base_url);
    let response = client
        .post(&url)
        .json(&category)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    println!("Requesting PUT: {}", url);
    println!("Payload: {:?}", category);
    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);

    Ok(())
}

// Delete a category by ID
pub async fn delete_category(client: &Client, id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/categories/{}", base_url, id);

    let response = client
        .delete(&url)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);
    Ok(())
}

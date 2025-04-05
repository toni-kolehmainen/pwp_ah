use crate::api::utils::get_base_url;
use crate::models::{Category, HalCategoryResponse, HalCategoryWrapper};
use reqwest::{header, Client};
use std::error::Error;

pub async fn fetch_categories(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/categories", base_url);
    let hal: HalCategoryResponse = client.get(url).send().await?.json().await?;
    for wrapper in hal.embedded.items {
        let category = &wrapper.category;
        println!(
            "ID: {}, Name: {}, Description: {}",
            category.id.unwrap_or_default(),
            category.name,
            category.description
        );
    }
    Ok(())
}

pub async fn fetch_category(client: &Client, id: &i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/categories/{}", base_url, id);

    let res = client.get(url).send().await?;
    let wrapper: HalCategoryWrapper = res.json().await?;
    let category = &wrapper.category;
    println!("Item:");
    println!("  ID: {}", category.id.unwrap_or_default());
    println!("  Name: {}", category.name);
    println!("  Description: {}", category.description);

    println!("Links:");
    println!("  self: {}", wrapper.links.self_link.href);
    if let Some(edit) = &wrapper.links.edit {
        println!("  edit: {}", edit.href);
    }
    if let Some(delete) = &wrapper.links.delete {
        println!("  delete: {}", delete.href);
    }
    Ok(())
}

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

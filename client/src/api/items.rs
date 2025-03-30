use crate::api::utils::get_base_url;
use crate::models::{HalItemResponse, HalItemWrapper, Item};
use reqwest::{header, Client};
use std::error::Error;

pub async fn fetch_items(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items", base_url);
    let hal: HalItemResponse = client.get(url).send().await?.json().await?;
    for wrapper in hal.embedded.items {
        let item = wrapper.item;
        println!(
            "Name: {}, Description: {}, Category ID: {}",
            item.name, item.description, item.categoryId
        );
    }
    Ok(())
}

pub async fn fetch_item(client: &Client, item_id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items/{}", base_url, item_id);

    let response = client.get(&url).send().await;
    match response {
        Ok(res) => {
            let body = res.text().await?;
            println!("Response body: {}", body);

            let wrapper: HalItemWrapper = serde_json::from_str(&body)?;
            let item = wrapper.item;

            println!("Name: {}, Description: {}", item.name, item.description);
            Ok(())
        }
        Err(e) => {
            eprintln!("Failed to fetch item: {}", e);
            Err(Box::new(e))
        }
    }
}

pub async fn add_item(client: &Client, item: Item) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items/{}", base_url, item.userId);

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

pub async fn update_item(client: &Client) -> Result<(), Box<dyn Error>> {
    Ok(())
}

pub async fn delete_item(client: &Client) -> Result<(), Box<dyn Error>> {
    Ok(())
}

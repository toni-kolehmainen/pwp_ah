use crate::api::utils::get_base_url;
use crate::models::{
    HalItemResponse, HalItemResponse2, HalItemWrapper, HalItemWrapper2, Item, ItemPayload,
};
use reqwest::{header, Client};
use std::collections::HashMap;
use std::error::Error;

pub async fn fetch_items(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items", base_url);
    let hal: HalItemResponse2 = client.get(url).send().await?.json().await?;
    for wrapper in hal.embedded.items {
        let item = &wrapper.dataValues;
        println!(
            "ID: {}, Name: {}, Description: {}, Category ID: {}, User ID: {}",
            item.id.unwrap_or_default(),
            item.name,
            item.description,
            item.categoryId,
            item.userId
        );
    }
    Ok(())
}

pub async fn fetch_item(client: &Client, item_id: &i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items/{}", base_url, item_id);

    let res = client.get(url).send().await?;
    let wrapper: HalItemWrapper = res.json().await?;
    let item = &wrapper.item;
    println!("Item:");
    println!("  ID: {}", item.id.unwrap_or_default());
    println!("  Name: {}", item.name);
    println!("  Description: {}", item.description);

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

pub async fn add_item(client: &Client, item: Item) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items", base_url);

    let response = client
        .post(&url)
        .json(&item)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    println!("Requesting PUT: {}", url);
    println!("Payload: {:?}", item);
    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);

    Ok(())
}

pub async fn update_item(
    client: &Client,
    item: ItemPayload,
    item_id: &i32,
) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items/{}", base_url, item_id);
    println!("Requesting PUT: {}", url);
    println!("Payload: {:?}", item);
    let response = client.put(&url).json(&item).send().await?;
    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);

    Ok(())
}

pub async fn delete_item(client: &Client, item_id: &i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items/{}", base_url, item_id);

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

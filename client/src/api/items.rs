// API client functions for interacting with the items endpoints.

use crate::api::utils::get_base_url;
use crate::models::{ItemPayload2};
use reqwest::{header, Client};
use std::error::Error;

// Fetch all items and print their data values
pub async fn fetch_items(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items", base_url);
    let res = client.get(&url).send().await?;
    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await.unwrap_or_else(|_| "".to_string());
        eprintln!("Failed to fetch items. Status: {}, Body: {}", status, body);
        return Err(format!("Failed to fetch items: {}", status).into());
    }
    let body = res.text().await?;
    let json: serde_json::Value = match serde_json::from_str(&body) {
        Ok(j) => j,
        Err(e) => {
            eprintln!("Failed to parse items as JSON: {}", e);
            eprintln!("Raw body: {}", body);
            return Err("Failed to parse items as JSON".into());
        }
    };

    // Only print dataValues for each item
    if let Some(embedded) = json.get("_embedded").and_then(|e| e.get("items")) {
        if let Some(arr) = embedded.as_array() {
            for item in arr {
                if let Some(obj) = item.as_object() {
                    if let Some(data_values) = obj.get("dataValues").and_then(|v| v.as_object()) {
                        println!("Item:");
                        for (k, v) in data_values.iter() {
                            println!("  {}: {}", k, v);
                        }
                    }
                }
            }
        }
    } else if let Some(arr) = json.as_array() {
        for item in arr {
            if let Some(obj) = item.as_object() {
                if let Some(data_values) = obj.get("dataValues").and_then(|v| v.as_object()) {
                    println!("Item:");
                    for (k, v) in data_values.iter() {
                        println!("  {}: {}", k, v);
                    }
                }
            }
        }
    } else if let Some(obj) = json.as_object() {
        if let Some(data_values) = obj.get("dataValues").and_then(|v| v.as_object()) {
            println!("Item:");
            for (k, v) in data_values.iter() {
                println!("  {}: {}", k, v);
            }
        }
    }
    Ok(())
}

// Fetch a single item by ID and print its data values
pub async fn fetch_item(client: &Client, item_id: &i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items/{}", base_url, item_id);
    println!("Requesting GET: {}", url);
    let res = client.get(&url).send().await?;
    if !res.status().is_success() {
        let status = res.status();
        let body = res.text().await.unwrap_or_else(|_| "".to_string());
        eprintln!("Failed to fetch item. Status: {}, Body: {}", status, body);
        return Err(format!("Failed to fetch item: {}", status).into());
    }
    let body = res.text().await?;
    let json: serde_json::Value = match serde_json::from_str(&body) {
        Ok(j) => j,
        Err(e) => {
            eprintln!("Failed to parse item as JSON: {}", e);
            eprintln!("Raw body: {}", body);
            return Err("Failed to parse item as JSON".into());
        }
    };

    // Print dataValues if present, otherwise print all fields except _links
    if let Some(obj) = json.as_object() {
        if let Some(data_values) = obj.get("dataValues").and_then(|v| v.as_object()) {
            println!("Item:");
            for (k, v) in data_values.iter() {
                println!("  {}: {}", k, v);
            }
        } else {
            println!("Item:");
            for (k, v) in obj.iter() {
                if k != "_links" {
                    println!("  {}: {}", k, v);
                }
            }
        }
    }
    Ok(())
}

// Create a new item using the provided payload
pub async fn add_item(client: &Client, item: ItemPayload2) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/items", base_url);

    let response = client
        .post(&url)
        .json(&item)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    println!("Requesting PUT: {}", url);
    println!("Payload: {}", serde_json::to_string_pretty(&item).unwrap_or_default());
    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);

    Ok(())
}

// Update an existing item by ID
pub async fn update_item(
    client: &Client,
    item: ItemPayload2,
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

// Delete an item by ID
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

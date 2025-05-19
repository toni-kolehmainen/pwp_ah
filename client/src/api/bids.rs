// API client functions for interacting with the bids endpoints.

use crate::api::utils::get_base_url;
use crate::models::bids::{BidPayload, HalBidResponse, HalBidWrapper};
use reqwest::{header, Client};
use std::error::Error;

// Fetch all bids and print their details
pub async fn fetch_bids(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/bids", base_url);

    let res = client.get(&url).send().await?;
    let hal: HalBidResponse = res.json().await?;

    for wrapper in hal.embedded.bids {
        let bid = &wrapper.bid;
        println!(
            "ID: {}, Amount: {}, Time: {}",
            bid.id.unwrap(),
            bid.amount,
            bid.buy_time
        );
        println!("  self: {}", wrapper.links.self_link.href);
        if let Some(delete) = &wrapper.links.delete {
            println!("  delete: {}", delete.href);
        }
        println!("---");
    }

    Ok(())
}

// Fetch a single bid by ID and print its details
pub async fn fetch_bid(client: &Client, bid_id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/bids/{}", base_url, bid_id);

    let res = client.get(&url).send().await?;
    let wrapper: HalBidWrapper = res.json().await?;
    let bid = &wrapper.bid;

    println!("Bid:");
    println!(
        "ID: {}, Amount: {}, Time: {}",
        bid.id.unwrap(),
        bid.amount,
        bid.buy_time
    );
    println!("Links:");
    println!("  self: {}", wrapper.links.self_link.href);
    if let Some(delete) = &wrapper.links.delete {
        println!("  delete: {}", delete.href);
    }

    Ok(())
}

// Create a new bid using the provided payload
pub async fn create_bid(client: &Client, payload: BidPayload) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/bids", base_url);

    // Read the auth token from file
    let token = std::fs::read_to_string(".auth_token")?.trim().to_string();

    let response = client
        .post(&url)
        .json(&payload)
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await?;

    println!("Requesting PUT: {}", url);
    println!("Payload: {:?}", payload);
    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);

    Ok(())
}

// Delete a bid by ID
pub async fn delete_bid(client: &Client, bid_id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/bids/{}", base_url, bid_id);

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

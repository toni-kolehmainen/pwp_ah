// Auction API client functions for interacting with the backend auctions endpoints.

use crate::api::utils::get_base_url;
use crate::models::auctions::{Auction, AuctionPayload, HalAuctionResponse, HalAuctionWrapper};
use reqwest::{header, Client};
use std::error::Error;

// Fetch all auctions and print their details
pub async fn fetch_auctions(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/auctions", base_url);

    let res = client.get(&url).send().await?;
    let hal: HalAuctionResponse = res.json().await?;

    for wrapper in hal.embedded.auctions {
        let auction = &wrapper.auction;

        println!("ID: {}", auction.id.unwrap_or_default());
        println!("Description: {}", auction.description);

        // Print item and seller IDs if available
        match (auction.item_id, auction.seller_id) {
            (Some(item_id), Some(seller_id)) => {
                println!("Item ID: {}, Seller ID: {}", item_id, seller_id);
            }
            _ => println!("Item ID or Seller ID is missing"),
        }

        println!(
            "Starting price: {}, Current price: {}",
            auction.starting_price, auction.current_price
        );

        // Print HAL links for the auction
        println!("Links:");
        println!("  self: {}", wrapper.links.self_link.href);
        if let Some(edit) = &wrapper.links.edit {
            println!("  edit: {}", edit.href);
        }
        if let Some(delete) = &wrapper.links.delete {
            println!("  delete: {}", delete.href);
        }
        println!("---");
    }

    Ok(())
}

// Fetch a single auction by ID and print its details
pub async fn fetch_auction(client: &Client, auction_id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/auctions/{}", base_url, auction_id);

    let res = client.get(&url).send().await?;
    let wrapper: HalAuctionWrapper = res.json().await?;

    let auction = &wrapper.auction;
    println!("Auction ID: {}", auction.id.unwrap_or_default());
    println!("Description: {}", auction.description);

    // Print item and seller IDs if available
    match (auction.item_id, auction.seller_id) {
        (Some(item_id), Some(seller_id)) => {
            println!("Item ID: {}, Seller ID: {}", item_id, seller_id);
        }
        _ => println!("Item ID or Seller ID missing"),
    }

    println!(
        "Starting price: {}, Current price: {}",
        auction.starting_price, auction.current_price
    );

    // Print HAL links for the auction
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

// Create a new auction using the provided payload
pub async fn create_auction(
    client: &Client,
    auction: AuctionPayload,
) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/auctions", base_url);

    // Read the auth token from file
    let token = std::fs::read_to_string(".auth_token")?.trim().to_string();

    let res = client
        .post(&url)
        .json(&auction)
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await?;

    let status = res.status();
    let body = res.text().await?;

    if status.is_success() {
        let created: HalAuctionWrapper = serde_json::from_str(&body)?;
        println!("Auction created:");
        println!("ID: {}", created.auction.id.unwrap());
        println!("Description: {}", created.auction.description);
    } else {
        eprintln!("Failed to create auction: {} - {}", status, body);
    }

    Ok(())
}

// Delete an auction by ID
pub async fn delete_auction(client: &Client, id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/auctions/{}", base_url, id);

    // Read the auth token from file
    let token = std::fs::read_to_string(".auth_token")?.trim().to_string();

    let res = client
        .delete(&url)
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await?;

    let status = res.status();
    let body = res.text().await?;

    if status.is_success() {
        println!("Auction {} deleted successfully", id);
    } else {
        eprintln!("Failed to delete auction: {} - {}", status, body);
    }

    Ok(())
}

mod api;
mod models;

use api::{fetch_categories, fetch_items, fetch_users};
use clap::{ArgMatches, Command};
use reqwest::Client;
use std::error::Error;

fn get_matches() -> ArgMatches {
    Command::new("Auction House CLI")
        .version("1.0")
        .author("Your Name")
        .about("Interacts with the Auction House API")
        .subcommand(Command::new("fetch-users").about("Fetch all users"))
        .subcommand(Command::new("fetch-items").about("Fetch all items"))
        .subcommand(Command::new("fetch-categories").about("Fetch all categories"))
        .get_matches()
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let matches = get_matches();
    let client = Client::new();

    if let Some(_) = matches.subcommand_matches("fetch-users") {
        fetch_users(&client).await?;
    } else if let Some(_) = matches.subcommand_matches("fetch-items") {
        fetch_items(&client).await?;
    } else if let Some(_) = matches.subcommand_matches("fetch-categories") {
        fetch_categories(&client).await?;
    }

    Ok(())
}

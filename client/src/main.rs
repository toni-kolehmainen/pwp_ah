mod api;
mod models;

use crate::models::Item;
use api::{add_category, add_item, fetch_categories, fetch_items, fetch_user, fetch_users};
use clap::{Parser, Subcommand};
use reqwest::Client;
use std::error::Error;

#[derive(Parser, Debug)]
#[clap(author, version, about)]
struct Args {
    #[clap(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Fetch all users
    FetchUsers,

    /// Fetch a user by ID
    FetchUser {
        /// User ID
        id: u32,
    },

    /// Fetch all items
    FetchItems,

    /// Create new item
    CreateItem {
        name: String,
        description: String,
        userId: i32,
        categoryId: i32,
    },

    /// Fetch all categories
    FetchCategories,

    /// Create new category
    AddCategory {
        /// Category Name
        name: String,
        /// Category Description
        description: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let args = Args::parse();

    let client = Client::new();

    match args.command {
        Commands::FetchUsers => {
            fetch_users(&client).await?;
        }
        Commands::FetchUser { id } => {
            fetch_user(&client, id.try_into().unwrap()).await?;
        }
        Commands::FetchItems => {
            fetch_items(&client).await?;
        }
        Commands::CreateItem {
            name,
            description,
            userId,
            categoryId,
        } => {
            let item = Item {
                name,
                description,
                userId,
                categoryId,
            };
            add_item(&client, item).await?;
        }
        Commands::FetchCategories => {
            fetch_categories(&client).await?;
        }
        Commands::AddCategory { name, description } => {
            add_category(&client, name, description).await?
        }
        _ => unimplemented!(),
    }

    Ok(())
}

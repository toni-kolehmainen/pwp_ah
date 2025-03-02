mod api;
mod models;

use crate::models::{Item, User};
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
        id: i32,
    },

    /// Create new user
    CreateUser {
        name: String,
        nickname: String,
        email: String,
        phone: String,
        password: String,
    },

    /// Delete user by ID
    DeleteUser { id: i32 },

    /// Update existing user by ID
    UpdateUser { id: i32 },

    /// Fetch all items
    FetchItems,

    /// Create new item
    AddItem {
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
            api::fetch_users(&client).await?;
        }
        Commands::FetchUser { id } => {
            api::fetch_user(&client, id.try_into().unwrap()).await?;
        }
        Commands::CreateUser {
            name,
            nickname,
            email,
            phone,
            password,
        } => {
            let user = User {
                id: None,
                name,
                nickname,
                email,
                phone,
                password,
            };
            api::add_user(&client, user).await?;
        }
        Commands::DeleteUser { id } => {
            api::delete_user(&client, id).await?;
        }
        Commands::UpdateUser { id } => {
            api::update_user(&client).await?;
        }
        Commands::FetchItems => {
            api::fetch_items(&client).await?;
        }
        Commands::AddItem {
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
            api::add_item(&client, item).await?;
        }
        Commands::FetchCategories => {
            api::fetch_categories(&client).await?;
        }
        Commands::AddCategory { name, description } => {
            api::add_category(&client, name, description).await?
        }
        _ => unimplemented!(),
    }

    Ok(())
}

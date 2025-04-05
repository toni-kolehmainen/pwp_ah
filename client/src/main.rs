mod api;
mod models;

use crate::models::{Item, ItemPayload, User};
use clap::{Parser, Subcommand};
use reqwest::Client;
use std::error::Error;

#[derive(Parser, Debug)]
#[clap(author, version, about)]
struct Args {
    #[clap(subcommand)]
    command: MainCommand,
}

#[derive(Subcommand, Debug)]
enum MainCommand {
    /// Commands related to users
    User(UserGroup),
    /// Commands related to items
    Item(ItemGroup),
    /// Commands related to categories
    Category(CategoryGroup),
}

#[derive(Parser, Debug)]
struct UserGroup {
    #[clap(subcommand)]
    command: UserCommands,
}

#[derive(Subcommand, Debug)]
enum UserCommands {
    /// Login User,
    Login {
        id: i32,
        email: String,
        password: String,
    },
    /// Fetch all users
    FetchUsers,
    /// Fetch a user by ID
    FetchUser { id: i32 },
    /// Create a new user
    CreateUser {
        name: String,
        nickname: String,
        email: String,
        phone: String,
        password: Option<String>,
    },
    /// Delete a user by ID
    DeleteUser { id: i32 },
    /// Update an existing user by ID
    UpdateUser { id: i32 },
}

#[derive(Parser, Debug)]
struct ItemGroup {
    #[clap(subcommand)]
    command: ItemCommands,
}

#[derive(Subcommand, Debug)]
enum ItemCommands {
    /// Fetch all items
    FetchItems,
    /// Fetch 1 item
    FetchItem { id: i32 },
    /// Create a new item
    AddItem {
        name: String,
        description: String,
        userId: i32,
        categoryId: i32,
    },
    /// Update existing item
    UpdateItem {
        id: i32,
        name: String,
        description: String,
        userId: i32,
        categoryId: i32,
    },
    /// Delete item
    DeleteItem { id: i32 },
}

#[derive(Parser, Debug)]
struct CategoryGroup {
    #[clap(subcommand)]
    command: CategoryCommands,
}

#[derive(Subcommand, Debug)]
enum CategoryCommands {
    /// Fetch all categories
    FetchCategories,
    /// Create a new category
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
        MainCommand::User(user_group) => match user_group.command {
            UserCommands::Login {
                id,
                email,
                password,
            } => {
                api::login_user(&client, id, email, password).await?;
            }
            UserCommands::FetchUsers => {
                api::fetch_users(&client).await?;
            }
            UserCommands::FetchUser { id } => {
                api::fetch_user(&client, id).await?;
            }
            UserCommands::CreateUser {
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
            UserCommands::DeleteUser { id } => {
                api::delete_user(&client, id).await?;
            }
            UserCommands::UpdateUser { id } => {
                api::update_user(&client).await?;
            }
        },
        MainCommand::Item(item_group) => match item_group.command {
            ItemCommands::FetchItems => {
                api::fetch_items(&client).await?;
            }
            ItemCommands::FetchItem { id } => {
                api::fetch_item(&client, &id).await?;
            }
            ItemCommands::AddItem {
                name,
                description,
                userId,
                categoryId,
            } => {
                let item = Item {
                    id: None,
                    name,
                    description,
                    userId,
                    categoryId,
                };
                api::add_item(&client, item).await?;
            }
            ItemCommands::UpdateItem {
                id,
                name,
                description,
                userId,
                categoryId,
            } => {
                let item = ItemPayload {
                    name,
                    description,
                    userId,
                    categoryId,
                };
                api::update_item(&client, item, &id).await?;
            }
            ItemCommands::DeleteItem { id } => {
                api::delete_item(&client, &id).await?;
            }
        },
        MainCommand::Category(category_group) => match category_group.command {
            CategoryCommands::FetchCategories => {
                api::fetch_categories(&client).await?;
            }
            CategoryCommands::AddCategory { name, description } => {
                api::add_category(&client, name, description).await?;
            }
        },
    }

    Ok(())
}

mod api;
mod models;

use crate::models::{Item, ItemPayload, User};
use clap::{Parser, Subcommand};
use models::{Category, UserPayload};
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
    /// Commands related to bids
    Bid(BidGroup),
}

#[derive(Parser, Debug)]
struct BidGroup {
    #[clap(subcommand)]
    command: BidCommands,
}

#[derive(Subcommand, Debug)]
enum BidCommands {
    /// Fetch bids
    FetchBids,
    /// Fetch bid by id
    FetchBid { id: i32 },
    /// Create new bid
    CreateBid { amount: f32, buy_time: String },
    /// Delete existing bid
    DeleteBid { id: i32 },
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
    /// Update an existing user by ID
    UpdateUser {
        id: i32,
        name: String,
        nickname: String,
        email: String,
        phone: String,
        password: String,
    },
    /// Delete a user by ID
    DeleteUser { id: i32 },
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
    /// TODO OR REMOVE!!!! Fetch category by id
    FetchCategory { id: i32 },
    /// Create a new category
    AddCategory {
        /// Category Name
        name: String,
        /// Category Description
        description: String,
    },
    /// Delete Category
    DeleteCategory { id: i32 },
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
            UserCommands::UpdateUser {
                id,
                name,
                nickname,
                email,
                phone,
                password,
            } => {
                let user_update = UserPayload {
                    name,
                    nickname,
                    email,
                    phone,
                    password,
                };
                api::update_user(&client, user_update, id).await?;
            }
            UserCommands::DeleteUser { id } => {
                api::delete_user(&client, id).await?;
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
            CategoryCommands::FetchCategory { id } => {
                api::fetch_category(&client, &id).await?;
            }
            CategoryCommands::AddCategory { name, description } => {
                let category = Category {
                    id: None,
                    name,
                    description,
                };
                api::add_category(&client, category).await?;
            }
            CategoryCommands::DeleteCategory { id } => {
                api::delete_category(&client, id).await?;
            }
        },
    }

    Ok(())
}

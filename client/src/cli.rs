// Main CLI entrypoint for the Auction House client.
// Provides both interactive and command-based modes for interacting with the API.

use crate::api;
use crate::api::utils::fetch_api_root_links;
use crate::models::{Category, CreateBid, Item2, ItemPayload, ItemPayload2, User, UserPayload};
use clap::{Parser, Subcommand};
use reqwest::Client;
use std::error::Error;
use std::io::Write;
use colored::*;

// Command-line argument parsing using clap
#[derive(Parser, Debug)]
#[clap(author, version, about)]
pub struct Args {
    #[clap(subcommand)]
    pub command: CliMode,
}

// Top-level CLI mode: interactive or command-based
#[derive(Subcommand, Debug, Clone)]
pub enum CliMode {
    /// Interactive hypermedia-driven CLI
    Interactive,
    /// Old command-based CLI
    Command(OldArgs),
}

#[derive(Parser, Debug, Clone)]
pub struct OldArgs {
    #[clap(subcommand)]
    pub command: MainCommand,
}

#[derive(Subcommand, Debug, Clone)]
pub enum MainCommand {
    /// Commands related to users
    User(UserGroup),
    /// Commands related to items
    Item(ItemGroup),
    /// Commands related to categories
    Category(CategoryGroup),
    /// Commands related to bids
    Bid(BidGroup),
    /// Commands related to auctions
    Auction(AuctionGroup),
}

#[derive(Parser, Debug, Clone)]
pub struct AuctionGroup {
    #[clap(subcommand)]
    pub command: AuctionCommands,
}

#[derive(Subcommand, Debug, Clone)]
pub enum AuctionCommands {
    /// Fetch all auctions
    FetchAuctions,
    /// Fetch one auction by ID
    FetchAuction { id: i32 },
    /// Create new auction
    CreateAuction {
        item_id: i32,
        description: String,
        starting_price: f32,
        end_time: String,
    },
    /// Delete auction by ID
    DeleteAuction { id: i32 },
}

#[derive(Parser, Debug, Clone)]
pub struct BidGroup {
    #[clap(subcommand)]
    pub command: BidCommands,
}

#[derive(Subcommand, Debug, Clone)]
pub enum BidCommands {
    /// Fetch bids
    FetchBids,
    /// Fetch bid by id
    FetchBid { id: i32 },
    /// Create new bid
    CreateBid {
        auction_id: i32,
        buyer_id: i32,
        amount: f32,
    },
    /// Delete existing bid
    DeleteBid { id: i32 },
}

#[derive(Parser, Debug, Clone)]
pub struct UserGroup {
    #[clap(subcommand)]
    pub command: UserCommands,
}

#[derive(Subcommand, Debug, Clone)]
pub enum UserCommands {
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

#[derive(Parser, Debug, Clone)]
pub struct ItemGroup {
    #[clap(subcommand)]
    pub command: ItemCommands,
}

#[derive(Subcommand, Debug, Clone)]
pub enum ItemCommands {
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

#[derive(Parser, Debug, Clone)]
pub struct CategoryGroup {
    #[clap(subcommand)]
    pub command: CategoryCommands,
}

#[derive(Subcommand, Debug, Clone)]
pub enum CategoryCommands {
    /// Fetch all categories
    FetchCategories,
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

// Main CLI runner: parses arguments, prints API entrypoints, and dispatches to the correct mode
pub async fn run_cli() -> Result<(), Box<dyn Error>> {
    let args = Args::parse();
    let client = Client::new();

    // Fetch API root links for navigation
    let api_links = fetch_api_root_links().await;
    if api_links.is_none() {
        eprintln!("No _links found. Exiting.");
        return Ok(());
    }
    let api_links = api_links.unwrap();

    // Print available API entrypoints for user reference
    println!("Available API entrypoints:");
    for (name, link) in &api_links {
        println!("  {}: {} [{}]", name.blue(), link.href.green(), link.method.as_deref().unwrap_or("GET"));
    }

    // Dispatch to interactive or command-based CLI
    match args.command {
        CliMode::Interactive => {
            crate::cli::run_interactive(&client).await?;
        }
        CliMode::Command(old_args) => {
            match old_args.command {
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
                        let item = ItemPayload2 {
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
                        let item = ItemPayload2 {
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
                MainCommand::Bid(bid_group) => match bid_group.command {
                    BidCommands::FetchBids => {
                        api::fetch_bids(&client).await?;
                    }
                    BidCommands::FetchBid { id } => {
                        api::fetch_bid(&client, id).await?;
                    }
                    BidCommands::CreateBid {
                        auction_id,
                        buyer_id,
                        amount,
                    } => {
                        let bid = CreateBid {
                            id: 0,
                            amount: amount.to_string(),
                            buy_time: "".to_string(),
                        };
                        let payload = crate::models::bids::BidPayload {
                            auction_id,
                            buyer_id,
                            amount,
                        };
                        api::create_bid(&client, payload).await?;
                    }
                    BidCommands::DeleteBid { id } => {
                        api::delete_bid(&client, id).await?;
                    }
                },
                MainCommand::Auction(auction_group) => match auction_group.command {
                    AuctionCommands::FetchAuctions => {
                        api::fetch_auctions(&client).await?;
                    }
                    AuctionCommands::FetchAuction { id } => {
                        api::fetch_auction(&client, id).await?;
                    }
                    AuctionCommands::CreateAuction {
                        item_id,
                        description,
                        starting_price,
                        end_time,
                    } => {
                        let payload = crate::models::auctions::AuctionPayload {
                            item_id,
                            description,
                            starting_price,
                            end_time,
                        };
                        api::create_auction(&client, payload).await?;
                    }
                    AuctionCommands::DeleteAuction { id } => {
                        api::delete_auction(&client, id).await?;
                    }
                },
            }
        }
    }

    Ok(())
}

// Interactive hypermedia-driven CLI loop
// Navigates API using HAL links and prompts user for actions and input
async fn run_interactive(client: &Client) -> Result<(), Box<dyn Error>> {
    use crate::api::utils::get_base_url;
    use crate::api::login_user;
    use serde_json::Value;

    let mut auth_token: Option<String> = std::fs::read_to_string(".auth_token").ok().map(|s| s.trim().to_string());
    let mut current_url = get_base_url().await;
    let mut at_root = true; // Track if we're at the root level
    let res = client.get(&current_url).send().await?;
    let body = res.text().await?;
    let mut json: Value = match serde_json::from_str(&body) {
        Ok(j) => j,
        Err(_) => {
            println!("Failed to parse initial response as JSON:\n{}", body);
            return Ok(());
        }
    };

    // The loop below presents available actions, handles navigation, and processes user input.
    loop {
        let mut actions = vec![];
        let mut embedded_available = false;

        // Reload token at the start of each loop iteration
        auth_token = std::fs::read_to_string(".auth_token").ok().map(|s| s.trim().to_string());
        let logged_in = auth_token.as_ref().map(|t| !t.is_empty()).unwrap_or(false);

        // Only show login if not logged in
        if !logged_in {
            println!("  [L] Login");
        }
        if let Some(links) = json.get("_links") {
            println!("Available actions:");
            for (name, link) in links.as_object().unwrap().iter() {
                if name == "self" {
                    continue; // Skip self links from available actions
                }
                let method = link.get("method").and_then(|m| m.as_str()).unwrap_or("GET");
                let href = link.get("href").and_then(|h| h.as_str()).unwrap_or("");
                println!("  [{}] {} {} -> {}", actions.len() + 1, method.red(), name.blue(), href.green());
                actions.push((name.clone(), href.to_string(), method.to_string()));
            }
            if json.get("_embedded").is_some() {
                println!("  [{}] {}", actions.len() + 1, "View embedded resources".blue());
                embedded_available = true;
            }
            if at_root {
                println!("  [0] Exit");
            } else {
                println!("  [0] Back");
            }

            print!("Choose action (number{}): ", if !logged_in { " or L for login" } else { "" });
            std::io::stdout().flush().unwrap();
            let mut input = String::new();
            std::io::stdin().read_line(&mut input)?;
            let input = input.trim();

            // Handle login option only if not logged in
            if !logged_in && input.eq_ignore_ascii_case("l") {
                // Prompt for user id, email, password
                print!("User ID: ");
                std::io::stdout().flush().unwrap();
                let mut id_input = String::new();
                std::io::stdin().read_line(&mut id_input)?;
                let user_id = id_input.trim().parse::<i32>().unwrap_or(0);

                print!("Email: ");
                std::io::stdout().flush().unwrap();
                let mut email = String::new();
                std::io::stdin().read_line(&mut email)?;
                let email = email.trim().to_string();

                print!("Password: ");
                std::io::stdout().flush().unwrap();
                let mut password = String::new();
                std::io::stdin().read_line(&mut password)?;
                let password = password.trim().to_string();

                login_user(client, user_id, email, password).await?;
                // Reload token after login
                auth_token = std::fs::read_to_string(".auth_token").ok().map(|s| s.trim().to_string());
                continue;
            }

            let choice = input.parse::<usize>().unwrap_or(0);

            if choice == 0 {
                if at_root {
                    break; // Exit only at root
                } else {
                    // Go back one level: reload root and continue loop
                    current_url = get_base_url().await;
                    let res = client.get(&current_url).send().await?;
                    let body = res.text().await?;
                    json = match serde_json::from_str(&body) {
                        Ok(j) => j,
                        Err(_) => {
                            println!("Failed to parse initial response as JSON:\n{}", body);
                            return Ok(());
                        }
                    };
                    at_root = true;
                    continue;
                }
            }

            // Embedded resource selection
            if embedded_available && choice == actions.len() + 1 {
                if let Some(embedded) = json.get("_embedded") {
                    println!("Embedded resources:");
                    print_embedded(embedded);

                    // Flatten all embedded arrays into a single Vec<&serde_json::Value>
                    let flat_embedded: Vec<&serde_json::Value> = embedded.as_object().unwrap()
                        .values()
                        .flat_map(|v| v.as_array().map(|a| a.iter()).unwrap_or_else(|| [].iter()))
                        .collect();

                    println!("Select embedded resource number to view details, or 0 to go back:");
                    let mut emb_input = String::new();
                    std::io::stdin().read_line(&mut emb_input)?;
                    let emb_choice = emb_input.trim().parse::<usize>().unwrap_or(0);

                    if emb_choice == 0 {
                        continue;
                    }
                    if let Some(entry) = flat_embedded.get(emb_choice - 1) {
                        let obj = match entry.as_object() {
                            Some(obj) => obj,
                            None => {
                                println!("Invalid embedded resource.");
                                continue;
                            }
                        };
                        let links = match obj.get("_links") {
                            Some(links) => links,
                            None => {
                                println!("No _links for this resource.");
                                continue;
                            }
                        };
                        let self_link = match links.get("self") {
                            Some(self_link) => self_link,
                            None => {
                                println!("No self link for this resource.");
                                continue;
                            }
                        };
                        let href = match self_link.get("href").and_then(|h| h.as_str()) {
                            Some(href) => href,
                            None => {
                                println!("No href for self link.");
                                continue;
                            }
                        };
                        
                        let next_url = if href.starts_with("http") {
                            href.to_string()
                        } else if href.starts_with("/api") {
                            format!("{}{}", get_base_url().await.trim_end_matches("/api"), href)
                        } else {
                            format!("{}{}", get_base_url().await, href)
                        };
                        let res = client.get(&next_url).send().await?;
                        let body = res.text().await?;
                        match serde_json::from_str::<serde_json::Value>(&body) {
                            Ok(j) => {
                                if j.get("error").is_some() {
                                    println!("Error: {}", j.get("error").unwrap());
                                    continue;
                                }
                                json = j;
                                current_url = next_url;
                                at_root = false; // Now we're not at root
                                if let Some(obj) = json.as_object() {
                                    print_summary(obj);
                                }
                                continue;
                            }
                            Err(_) => {
                                println!("Failed to parse response as JSON:\n{}", body);
                                break;
                            }
                        }
                    } else {
                        println!("Invalid embedded resource selection.");
                        continue;
                    }
                }
                continue;
            }

            // Handle HTTP actions
            if let Some((name, href, method)) = actions.get(choice - 1) {
                let next_url = if href.starts_with("http") {
                    href.clone()
                } else if href.starts_with("/api") || href.starts_with("/profile") {
                    format!("{}{}", get_base_url().await.trim_end_matches("/api"), href)
                } else {
                    format!("{}{}", get_base_url().await, href)
                };

                let mut req = match method.as_str() {
                    "GET" => client.get(&next_url),
                    "DELETE" => client.delete(&next_url),
                    "POST" | "PUT" => {
                        if href.starts_with("/profile") {
                            client.get(&next_url)
                        } else {
                            // Try to fetch the profile for this resource
                            let profile_url = if href.starts_with("/api/") {
                                let profile_path = href.trim_start_matches("/api/").split('/').next().unwrap_or("");
                                format!("{}/profile/{}", get_base_url().await.trim_end_matches("/api"), profile_path)
                            } else {
                                format!("{}/profile/{}", get_base_url().await.trim_end_matches("/api"), name)
                            };
                            let profile_resp = client.get(&profile_url).send().await;
                            let mut body_map = serde_json::Map::new();

                            if let Ok(profile_resp) = profile_resp {
                                if let Ok(profile_json) = profile_resp.json::<Value>().await {
                                    if let Some(props) = profile_json.get("properties") {
                                        if let Some(obj) = props.as_object() {
                                            loop {
                                                let mut missing_required = false;
                                                println!("Please enter values for the following fields:");
                                                for (key, val) in obj.iter() {
                                                    // Skip readOnly fields
                                                    if val.get("readOnly").and_then(|v| v.as_bool()).unwrap_or(false) {
                                                        continue;
                                                    }
                                                    // Determine resource type from profile_url or name
                                                    let is_auction = profile_url.contains("/profile/auctions") || name == "auctions";
                                                    // Skip auto-generated fields for auctions only
                                                    if is_auction && ["id", "current_price", "seller_id", "start_time"].contains(&key.as_str()) {
                                                        continue;
                                                    }
                                                    // For other resources, skip only truly auto-generated fields
                                                    if !is_auction && ["id"].contains(&key.as_str()) {
                                                        continue;
                                                    }
                                                    let desc = val.get("description").and_then(|d| d.as_str()).unwrap_or("");
                                                    let typ = val.get("type").and_then(|t| t.as_str()).unwrap_or("");
                                                    let required = profile_json.get("required")
                                                        .and_then(|r| r.as_array())
                                                        .map(|arr| arr.iter().any(|v| v == key))
                                                        .unwrap_or(false);

                                                    // If already filled, show current value
                                                    let already = body_map.get(key);
                                                    if let Some(val) = already {
                                                        println!("{}{} ({}): [{}]", key, if required { " [required]" } else { "" }, desc, val);
                                                    } else {
                                                        print!("{}{} ({}): ", key, if required { " [required]" } else { "" }, desc);
                                                        std::io::stdout().flush().unwrap();
                                                        let mut input = String::new();
                                                        std::io::stdin().read_line(&mut input)?;
                                                        let input = input.trim();
                                                        if input.is_empty() {
                                                            if required {
                                                                println!("This field is required.");
                                                                missing_required = true;
                                                            }
                                                            continue;
                                                        }
                                                        // Parse input according to type
                                                        let value = match typ {
                                                            "integer" => match input.parse::<i64>() {
                                                                Ok(v) => Value::from(v),
                                                                Err(_) => {
                                                                    println!("Invalid integer, skipping.");
                                                                    missing_required = true;
                                                                    continue;
                                                                }
                                                            },
                                                            "number" => match input.parse::<f64>() {
                                                                Ok(v) => Value::from(v),
                                                                Err(_) => {
                                                                    println!("Invalid number, skipping.");
                                                                    missing_required = true;
                                                                    continue;
                                                                }
                                                            },
                                                            _ => Value::from(input),
                                                        };
                                                        body_map.insert(key.clone(), value);
                                                    }
                                                }
                                                // Check if all required fields are present and non-empty
                                                let required_fields = profile_json.get("required")
                                                    .and_then(|r| r.as_array())
                                                    .map(|arr| arr.iter().filter_map(|v| v.as_str()).collect::<Vec<_>>())
                                                    .unwrap_or_default();
                                                let mut all_required_present = true;
                                                for req in &required_fields {
                                                    if !body_map.contains_key(*req) || body_map[*req].is_null() || (body_map[*req].is_string() && body_map[*req].as_str().unwrap().is_empty()) {
                                                        println!("Missing required field: {}", req);
                                                        all_required_present = false;
                                                        missing_required = true;
                                                    }
                                                }
                                                if !missing_required && all_required_present {
                                                    break;
                                                } else {
                                                    println!("Please fill in all required fields.");
                                                }
                                            }
                                        }
                                    }
                                    if let Some(actions) = profile_json.get("actions") {
                                        print_profile_actions(actions);
                                    }
                                }
                            }
                            let json_body = Value::Object(body_map);
                            if method == "POST" {
                                client.post(&next_url).json(&json_body)
                            } else {
                                client.put(&next_url).json(&json_body)
                            }
                        }
                    }
                    _ => {
                        println!("Unsupported HTTP method: {}", method);
                        continue;
                    }
                };

                // Attach Authorization header if token is present
                if let Some(token) = &auth_token {
                    req = req.header("Authorization", format!("Bearer {}", token));
                }

                // Send the request
                let response = req.send().await?;
                let resp_text = response.text().await?;
                if resp_text.trim().is_empty() {
                    println!("{}.", "No auctions found".yellow());
                    current_url = get_base_url().await;
                    let res = client.get(&current_url).send().await?;
                    let body = res.text().await?;
                    json = match serde_json::from_str(&body) {
                        Ok(j) => j,
                        Err(_) => {
                            println!("Failed to parse initial response as JSON:\n{}", body);
                            return Ok(());
                        }
                    };
                    at_root = true;
                    continue;
                }
                match serde_json::from_str::<serde_json::Value>(&resp_text) {
                    Ok(j) => {
                        json = j;
                        at_root = false; // Navigated away from root
                        if let Some(obj) = json.as_object() {
                            if !obj.contains_key("_embedded") {
                                print_summary(obj);
                            }
                        }
                        if let Some(embedded) = json.get("_embedded") {
                            println!("Embedded resources:");
                            print_embedded(embedded);
                        }
                        if json.get("_links").is_none() {
                            // Go back to root
                            current_url = get_base_url().await;
                            let res = client.get(&current_url).send().await?;
                            let body = res.text().await?;
                            json = match serde_json::from_str(&body) {
                                Ok(j) => j,
                                Err(_) => {
                                    println!("Failed to parse initial response as JSON:\n{}", body);
                                    return Ok(());
                                }
                            };
                            at_root = true;
                            continue;
                        }
                    }
                    Err(_) => {
                        println!("Failed to parse response as JSON.");
                        println!("Raw response:\n{}", resp_text);
                        // Optionally, reload root or previous state if needed
                        current_url = get_base_url().await;
                        let res = client.get(&current_url).send().await?;
                        let body = res.text().await?;
                        json = match serde_json::from_str(&body) {
                            Ok(j) => j,
                            Err(_) => {
                                println!("Failed to parse initial response as JSON:\n{}", body);
                                return Ok(());
                            }
                        };
                        at_root = true;
                        continue;
                    }
                }
                continue;
            } else {
                println!("Invalid choice.");
            }
        } else if let Some(embedded) = json.get("_embedded") {
            println!("Embedded resources:");
            print_embedded(embedded);
            println!("No further _links. Press Enter to go back.");
            let mut dummy = String::new();
            std::io::stdin().read_line(&mut dummy)?;
            break;
        } else {
            println!("No _links found. Response body:\n{}", body);
            break;
        }
        at_root = true; // If we break out, we're back at root
    }
    Ok(())
}

// Helper to print embedded resources in a user-friendly way
fn print_embedded(embedded: &serde_json::Value) {
    if let Some(obj) = embedded.as_object() {
        for (key, value) in obj.iter() {
            println!("  {}:", key.cyan());
            if let Some(arr) = value.as_array() {
                for (i, entry) in arr.iter().enumerate() {
                    if let Some(obj) = entry.as_object() {
                        if let Some(data_values) = obj.get("dataValues") {
                            if let Some(data_obj) = data_values.as_object() {
                                let summary = data_obj.iter()
                                    .map(|(k, v)| format!("{}: {}", k.green(), v))
                                    .collect::<Vec<_>>()
                                    .join(", ");
                                println!("    [{}] {}", i + 1, summary.red());
                                continue;
                            }
                        }
                        let summary = obj.iter()
                            .filter(|(k, _)| *k != "_links")
                            .map(|(k, v)| format!("{}: {}", k.green(), v))
                            .collect::<Vec<_>>()
                            .join(", ");
                        println!("    [{}] {}", i + 1, summary.red());
                    }
                }
            }
        }
    }
}

// Helper to print a summary line for a resource
fn print_summary(obj: &serde_json::Map<String, serde_json::Value>) {
    let summary = obj.iter()
        .filter(|(k, _)| *k != "_links" && *k != "_embedded")
        .map(|(k, v)| format!("{}: {}", k.green(), v))
        .collect::<Vec<_>>()
        .join(", ");
    println!("[self] {}", summary.red());
}

// Helper to print available profile actions for a resource
fn print_profile_actions(actions: &serde_json::Value) {
    if let Some(arr) = actions.as_array() {
        println!("Available actions:");
        for action in arr {
            let href = action.get("href").and_then(|v| v.as_str()).unwrap_or("");
            let method = action.get("method").and_then(|v| v.as_str()).unwrap_or("GET");
            let name = action.get("name").and_then(|v| v.as_str()).unwrap_or("");
            let title = action.get("title").and_then(|v| v.as_str()).unwrap_or("");
            let templated = action.get("templated").and_then(|v| v.as_bool()).unwrap_or(false);

            // Skip templated endpoints (like /api/auctions/:id) unless user is prompted for id
            if templated {
                println!(
                    "  {} {} {} (requires id)",
                    method.yellow(),
                    href.yellow(),
                    name.cyan()
                );
            } else {
                println!(
                    "  {} {} {} - {}",
                    method.green(),
                    href.blue(),
                    name.cyan(),
                    title
                );
            }
        }
    }
}

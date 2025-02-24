use crate::api::utils::get_base_url;
use crate::models::User;
use dotenv::dotenv;
use reqwest::Client;
use std::env;
use std::error::Error;

pub async fn fetch_users(client: &Client) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await; // Get the base URL once
    let url = format!("{}/users", base_url); // Append endpoint

    let response = client.get(&url).send().await;
    match response {
        Ok(res) => {
            let users: Vec<User> = res.json().await?;
            for user in users {
                println!("ID: {}, Name: {}", user.id, user.name);
            }
            Ok(())
        }
        Err(e) => {
            eprintln!("Failed to fetch users: {}", e);
            Err(Box::new(e))
        }
    }
}

pub async fn fetch_user(client: &Client, user_id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await; // Get the base URL once
    let url = format!("{}/user/{}", base_url, user_id); // Append the user ID to the URL
    println!("URL: {:?}", &url);

    let response = client.get(&url).send().await;
    match response {
        Ok(res) => {
            // Check the response body before attempting to deserialize
            let body = res.text().await?;
            println!("Response body: {}", body); // Log the response for debugging

            // Deserialize the user object
            let user: User = serde_json::from_str(&body)?;
            println!("ID: {}, Name: {}", user.id, user.name);
            Ok(())
        }
        Err(e) => {
            eprintln!("Failed to fetch user: {}", e);
            Err(Box::new(e))
        }
    }
}

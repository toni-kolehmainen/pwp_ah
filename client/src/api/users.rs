use crate::models::User;
use reqwest::Client;
use std::error::Error;

pub async fn fetch_users(client: &Client) -> Result<(), Box<dyn Error>> {
    let response = client.get("https://api.example.com/users").send().await;
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

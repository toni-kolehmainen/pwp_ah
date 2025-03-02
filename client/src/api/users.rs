use crate::api::utils::get_base_url;
use crate::models::User;
use dotenv::dotenv;
use reqwest::{header, Client};
use std::env;
use std::error::Error;
use std::time::Instant;

pub async fn login_user(client: &Client) -> Result<(), Box<dyn Error>> {
    Ok(())
}

pub async fn fetch_users(client: &Client) -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let base_url = get_base_url().await;
    let url = format!("{}/users", base_url);

    let response = client.get(&url).send().await;
    match response {
        Ok(res) => {
            let users: Vec<User> = res.json().await?;
            for user in users {
                println!("ID: {}, Name: {}", user.id.unwrap(), user.name);
            }
            let duration = start.elapsed();
            println!("Time taken: {:?}", duration);
            Ok(())
        }
        Err(e) => {
            eprintln!("Failed to fetch users: {}", e);
            Err(Box::new(e))
        }
    }
}

pub async fn fetch_user(client: &Client, user_id: i32) -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let base_url = get_base_url().await;
    let url = format!("{}/user/{}", base_url, user_id);
    println!("URL: {:?}", &url);

    let response = client.get(&url).send().await;
    match response {
        Ok(res) => {
            let body = res.text().await?;
            println!("Response body: {}", body);

            let user: User = serde_json::from_str(&body)?;
            println!("ID: {}, Name: {}", user.id.unwrap(), user.name);
            let duration = start.elapsed();
            println!("Time taken: {:?}", duration);
            Ok(())
        }
        Err(e) => {
            eprintln!("Failed to fetch user: {}", e);
            Err(Box::new(e))
        }
    }
}

pub async fn add_user(client: &Client, user: User) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/user", base_url);

    let response = client
        .post(&url)
        .json(&user)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    if response.status().is_success() {
        let created_user: User = response.json().await?;
        println!(
            "Created User - Name: {}, Description: {}",
            created_user.id.unwrap(),
            created_user.name
        );
    } else {
        eprintln!("Failed to create user: {}", response.status());
    }

    Ok(())
}

pub async fn update_user(client: &Client) -> Result<(), Box<dyn Error>> {
    Ok(())
}

pub async fn delete_user(client: &Client, id: i32) -> Result<(), Box<dyn Error>> {
    Ok(())
}

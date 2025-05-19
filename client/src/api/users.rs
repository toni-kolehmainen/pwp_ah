// API client functions for interacting with the users endpoints.

use crate::api::utils::{get_base_url};
use crate::models::{HalUserResponse, HalUserWrapper, LoginResponse, User, UserPayload};
use reqwest::{header, Client};
use std::collections::HashMap;
use std::error::Error;
use std::fs;
use std::time::Instant;

// Log in a user and save the auth token to .auth_token
pub async fn login_user(
    client: &Client,
    user_id: i32,
    email: String,
    password: String,
) -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let base_url = get_base_url().await;
    let url = format!("{}/login/{}", base_url, user_id);
    let mut payload = HashMap::new();
    payload.insert("email", email);
    payload.insert("password", password);
    let response = client
        .post(&url)
        .json(&payload)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    match response {
        Ok(res) => {
            if res.status().is_success() {
                let token: LoginResponse = res.json().await?;
                println!("Login successful");
                println!("Token: {}", token.token);
                fs::write(".auth_token", &token.token)?;
            } else {
                println!("Failed to login: HTTP {}", res.status());
            }
        }
        Err(e) => {
            println!("Failed to send request: {}", e);
            return Err(Box::new(e));
        }
    }
    let duration = start.elapsed();
    println!("Time taken: {:?}", duration);

    Ok(())
}

// Fetch all users and print their details and HAL links
pub async fn fetch_users(client: &Client) -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let base_url = get_base_url().await;
    let url = format!("{}/users", base_url);

    let response = client.get(&url).send().await?;
    let hal: HalUserResponse = response.json().await?;

    for wrapper in hal.embedded.users {
        let user = &wrapper.user;
        let links = &wrapper.links;

        println!(
            "User:\n  id: {}\n  name: {}\n  nickname: {}\n  email: {}\n  phone: {}",
            user.id.unwrap_or_default(),
            user.name,
            user.nickname,
            user.email,
            user.phone
        );

        println!("Links:");
        println!(
            "  self: {} {}",
            links.self_link.method.clone().unwrap_or("GET".into()),
            links.self_link.href
        );
        if let Some(edit) = &links.edit {
            println!(
                "  edit: {} {}",
                edit.method.clone().unwrap_or("PUT".into()),
                edit.href
            );
        }
        if let Some(delete) = &links.delete {
            println!(
                "  delete: {} {}",
                delete.method.clone().unwrap_or("DELETE".into()),
                delete.href
            );
        }
        println!("---");
    }

    println!("Time taken: {:?}", start.elapsed());
    Ok(())
}

// Fetch a single user by ID and print their details
pub async fn fetch_user(client: &Client, user_id: i32) -> Result<(), Box<dyn Error>> {
    let start = Instant::now();
    let base_url = get_base_url().await;
    let url = format!("{}/users/{}", base_url, user_id);
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

// Create a new user using the provided payload
pub async fn add_user(client: &Client, user: User) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/users", base_url);
    println!("Sending User JSON: {:?}", &user);

    let response = client
        .post(&url)
        .json(&user)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    if response.status().is_success() {
        let wrapper: HalUserWrapper = response.json().await?;
        let created_user = wrapper.user;

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

// Update an existing user by ID
pub async fn update_user(
    client: &Client,
    userUpdate: UserPayload,
    user_id: i32,
) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/users/{}", base_url, user_id);
    println!("Requesting PUT: {}", url);
    println!("Payload: {:?}", userUpdate);
    let response = client.put(&url).json(&userUpdate).send().await?;
    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);
    Ok(())
}

// Delete a user by ID
pub async fn delete_user(client: &Client, id: i32) -> Result<(), Box<dyn Error>> {
    let base_url = get_base_url().await;
    let url = format!("{}/users/{}", base_url, id);

    let response = client
        .delete(&url)
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await?;

    let status = response.status();
    let body = response.text().await?;

    println!("Response Status: {}", status);
    println!("Response Body: {}", body);
    Ok(())
}

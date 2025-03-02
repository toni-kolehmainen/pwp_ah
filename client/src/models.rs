use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct User {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
    pub name: String,
    pub nickname: String,
    pub email: String,
    pub phone: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub password: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Item {
    pub name: String,
    pub description: String,
    pub userId: i32,
    pub categoryId: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Category {
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Bid {
    pub id: i32,
    pub amount: f32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Auction {
    pub id: i32,
    pub description: String,
    pub end_time: NaiveDateTime,
    pub starting_price: f32,
    pub current_price: f32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginResponse {
    pub token: String,
}

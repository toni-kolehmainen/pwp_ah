use serde::{Deserialize, Serialize};
#[derive(Deserialize, Debug)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub nickname: String,
    pub email: String,
    pub phone: String,
    pub password: String,
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

use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct User {
    pub id: u32,
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct Item {
    pub name: String,
    pub description: String,
    pub category_id: u32,
}

#[derive(Deserialize, Debug)]
pub struct Category {
    pub name: String,
    pub description: String,
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Item2 {
    #[serde(skip_serializing_if = "Option::is_none", skip_serializing)]
    pub id: Option<i32>,
    pub name: String,
    pub description: String,
    #[serde(rename = "sellerId")]
    pub userId: i32,
    pub categoryId: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ItemPayload2 {
    pub name: String,
    pub description: String,
    #[serde(rename = "sellerId")]
    pub userId: i32,
    pub categoryId: i32,
}

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
pub struct UserPayload {
    pub name: String,
    pub nickname: String,
    pub email: String,
    pub phone: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Item {
    #[serde(skip_serializing)]
    pub id: Option<i32>,
    pub name: String,
    pub description: String,
    #[serde(rename = "sellerId")]
    pub userId: i32,
    pub categoryId: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ItemPayload {
    pub name: String,
    pub description: String,
    #[serde(rename = "sellerId")]
    pub userId: i32,
    pub categoryId: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Category {
    #[serde(skip_serializing)]
    pub id: Option<i32>,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginResponse {
    pub token: String,
}

#[derive(Deserialize, Debug)]
pub struct HalUserLinks {
    #[serde(rename = "self")]
    pub self_link: HalLink,
    pub edit: Option<HalLink>,
    pub delete: Option<HalLink>,
}

#[derive(Deserialize, Debug)]
pub struct HalLink {
    pub href: String,
    pub method: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct HalUserWrapper {
    #[serde(rename = "_links")]
    pub links: HalUserLinks,
    #[serde(flatten)]
    pub user: User,
}

#[derive(Deserialize, Debug)]
pub struct EmbeddedUsers {
    pub users: Vec<HalUserWrapper>,
}

#[derive(Deserialize, Debug)]
pub struct HalUserResponse {
    #[serde(rename = "_embedded")]
    pub embedded: EmbeddedUsers,
}
#[derive(Deserialize, Debug)]
pub struct HalItemLinks {
    #[serde(rename = "self")]
    pub self_link: HalLink,
    pub edit: Option<HalLink>,
    pub delete: Option<HalLink>,
}

#[derive(Deserialize, Debug)]
pub struct HalItemWrapper {
    #[serde(rename = "_links")]
    pub links: HalItemLinks,
    #[serde(flatten)]
    pub item: Item,
}

#[derive(Deserialize, Debug)]
pub struct HalItemWrapper2 {
    #[serde(rename = "_links")]
    pub links: HalItemLinks,
    pub dataValues: Item,
}

#[derive(Deserialize, Debug)]
pub struct EmbeddedItems {
    pub items: Vec<HalItemWrapper>,
}
#[derive(Deserialize, Debug)]
pub struct EmbeddedItems2 {
    pub items: Vec<HalItemWrapper2>,
}

#[derive(Deserialize, Debug)]
pub struct HalItemResponse {
    #[serde(rename = "_embedded")]
    pub embedded: EmbeddedItems,
}

#[derive(Deserialize, Debug)]
pub struct HalItemResponse2 {
    #[serde(rename = "_embedded")]
    pub embedded: EmbeddedItems2,
}

#[derive(Deserialize, Debug)]
pub struct EmbeddedCategories {
    #[serde(rename = "categories")]
    pub items: Vec<HalCategoryWrapper>,
}

#[derive(Deserialize, Debug)]
pub struct HalCategoryWrapper {
    #[serde(rename = "_links")]
    pub links: HalCategoryLinks,
    #[serde(flatten)]
    pub category: Category,
}

#[derive(Deserialize, Debug)]
pub struct HalCategoryResponse {
    #[serde(rename = "_embedded")]
    pub embedded: EmbeddedCategories,
}

#[derive(Deserialize, Debug)]
pub struct HalCategoryLinks {
    #[serde(rename = "self")]
    pub self_link: HalLink,
    pub edit: Option<HalLink>,
    pub delete: Option<HalLink>,
}

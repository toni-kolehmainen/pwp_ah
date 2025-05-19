use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};


#[derive(Debug, Deserialize)]
pub struct Auction {
    #[serde(skip_serializing)]
    pub id: Option<i32>,
    pub description: String,
    pub item_id: Option<i32>,
    pub seller_id: Option<i32>,
    pub start_time: Option<String>,
    pub end_time: String,
    pub starting_price: String,
    pub current_price: String,
}

#[derive(Debug, Serialize)]
pub struct AuctionPayload {
    pub item_id: i32,
    pub description: String,
    pub starting_price: f32,
    pub end_time: String,
}

#[derive(Debug, Deserialize)]
pub struct HalLink {
    pub href: String,
    pub method: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct HalAuctionLinks {
    #[serde(rename = "self")]
    pub self_link: HalLink,
    pub edit: Option<HalLink>,
    pub delete: Option<HalLink>,
}

#[derive(Debug, Deserialize)]
pub struct HalAuctionWrapper {
    #[serde(rename = "_links")]
    pub links: HalAuctionLinks,
    #[serde(flatten)]
    pub auction: Auction,
}

#[derive(Debug, Deserialize)]
pub struct EmbeddedAuctions {
    pub auctions: Vec<HalAuctionWrapper>,
}

#[derive(Debug, Deserialize)]
pub struct HalAuctionResponse {
    #[serde(rename = "_embedded")]
    pub embedded: EmbeddedAuctions,
}

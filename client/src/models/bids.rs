use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Bid {
    #[serde(skip_serializing)]
    pub id: Option<i32>,
    pub amount: String,
    pub buy_time: String, // chrono::NaiveDateTime
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BidPayload {
    #[serde(rename = "auction_id")]
    pub auction_id: i32,
    #[serde(rename = "buyer_id")]
    pub buyer_id: i32,
    pub amount: f32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateBid {
    pub id: i32,
    pub amount: String,
    pub buy_time: String,
}

#[derive(Debug, Deserialize)]
pub struct HalLink {
    pub href: String,
    pub method: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct HalBidLinks {
    #[serde(rename = "self")]
    pub self_link: HalLink,
    pub edit: Option<HalLink>,
    pub delete: Option<HalLink>,
}

#[derive(Debug, Deserialize)]
pub struct HalBidWrapper {
    #[serde(rename = "_links")]
    pub links: HalBidLinks,
    #[serde(flatten)]
    pub bid: Bid,
}

#[derive(Debug, Deserialize)]
pub struct EmbeddedBids {
    pub bids: Vec<HalBidWrapper>,
}

#[derive(Debug, Deserialize)]
pub struct HalBidResponse {
    #[serde(rename = "_embedded")]
    pub embedded: EmbeddedBids,
}

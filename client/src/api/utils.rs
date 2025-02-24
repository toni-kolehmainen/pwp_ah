use dotenv::dotenv;
use std::env;

pub async fn get_base_url() -> String {
    dotenv().ok();
    env::var("BASE_URL").unwrap_or_else(|_| "http://localhost:3001/api".to_string())
}

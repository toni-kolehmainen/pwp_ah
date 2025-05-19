// Main entrypoint for the Auction House client application.
// Initializes and runs the CLI.

mod api;
mod models;
mod cli;

use std::{error::Error};
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let _ = cli::run_cli().await;
    Ok(())
}
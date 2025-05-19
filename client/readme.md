# Rust CLI Client

This is a terminal-based client written in Rust for interacting with the Auction API.

## 🚀 Features

- Interactive hypermedia-driven CLI (follows _links and schemas)
- Command-based interface (e.g. `auction_cli command users fetch-users`)
- Works with all major API resources

## 🛠 Requirements

- Rust (stable) → https://rustup.rs
- Internet access to connect to the deployed API

## 🔧 Setup

### Interactive mode ((DEBUG))
```bash
cd client/
cargo clean
cargo run interactive
```

### Command mode (DEBUG)
```bash
cd client/
cargo clean
cargo run command #lists all commands
cargo run command user fetch-users
```

## Lint & test
```bash
rustup component add clippy
cargo clippy
cargo tarpaulin --out Html
```

## Release version
```bash
cargo build --release #release version found under ./target/release
./auction_cli interactive #interactive mode
./auction_cli command #command mode
```
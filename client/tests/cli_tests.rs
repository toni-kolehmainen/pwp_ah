use auction_cli::cli::{Args, CliMode, MainCommand, UserGroup, UserCommands, run_cli};
use clap::Parser;

#[test]
fn test_cli_args_parse_interactive() {
    let args = Args::parse_from(&["prog", "interactive"]);
    match args.command {
        CliMode::Interactive => (),
        _ => panic!("Expected Interactive mode"),
    }
}

#[test]
fn test_cli_args_parse_old_user_fetch() {
    let args = Args::parse_from(&["prog", "command", "user", "fetch-users"]);
    match args.command {
        CliMode::Command(old_args) => match old_args.command {
            MainCommand::User(user_group) => match user_group.command {
                UserCommands::FetchUsers => (),
                _ => panic!("Expected FetchUsers"),
            },
            _ => panic!("Expected User command"),
        },
        _ => panic!("Expected Command mode"),
    }
}

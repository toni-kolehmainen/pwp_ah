use auction_cli::models::HalUserWrapper;
use serde_json;

#[test]
fn test_deserialize_user() {
    let json = r#"{
        "_links": {
            "self": { "href": "/api/users/1" }
        },
        "id": 1,
        "name": "Test",
        "nickname": "T",
        "email": "t@example.com",
        "phone": "123456"
    }"#;

    let parsed: HalUserWrapper = serde_json::from_str(json).unwrap();
    assert_eq!(parsed.user.name, "Test");
}

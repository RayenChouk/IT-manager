# tests/test_auth.py

def test_login_wrong_password_returns_401(client, test_user):
    response = client.post("/auth/login", json={
        "username": test_user["username"],
        "password": "wrong_password",
    })
    assert response.status_code == 401


def test_login_nonexistent_user_returns_401(client):
    response = client.post("/auth/login", json={
        "username": "ghost_user",
        "password": "whatever123",
    })
    assert response.status_code == 401


def test_login_correct_credentials_returns_token(client, test_user):
    response = client.post("/auth/login", json={
        "username": test_user["username"],
        "password": test_user["password"],
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_equipment_list_without_token_returns_401_or_403(client):
    # No Authorization header at all
    response = client.get("/equipment/")
    assert response.status_code in (401, 403)
# tests/test_equipment.py

def test_create_equipment_success(client, auth_headers):
    response = client.post("/equipment/", json={
        "name": "Test Laptop",
        "serial_number": "TEST-001",
        "type": "Computer",
        "status": "Active",
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["serial_number"] == "TEST-001"


def test_create_equipment_duplicate_serial_returns_400(client, auth_headers):
    payload = {
        "name": "Test Laptop",
        "serial_number": "DUPLICATE-001",
        "type": "Computer",
        "status": "Active",
    }
    first = client.post("/equipment/", json=payload, headers=auth_headers)
    assert first.status_code == 201

    second = client.post("/equipment/", json=payload, headers=auth_headers)
    assert second.status_code == 400


def test_get_nonexistent_equipment_returns_404(client, auth_headers):
    response = client.get("/equipment/9999", headers=auth_headers)
    assert response.status_code == 404


def test_create_equipment_invalid_type_returns_422(client, auth_headers):
    response = client.post("/equipment/", json={
        "name": "Bad Type Item",
        "serial_number": "BAD-001",
        "type": "Toaster",
        "status": "Active",
    }, headers=auth_headers)
    assert response.status_code == 422
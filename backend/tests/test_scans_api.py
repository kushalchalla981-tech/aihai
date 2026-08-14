import uuid

from app.services.scanner import _finding_id

REPO_URL = "https://github.com/acme/app"


def _finding_id_for(rule_id, file, line):
    return _finding_id(REPO_URL, rule_id, file, line)


def test_create_scan_returns_201_and_queued(client, fake_run_scan):
    resp = client.post(
        "/api/v1/scans",
        json={"repo_url": REPO_URL, "name": "nightly"},
    )

    assert resp.status_code == 201
    body = resp.json()
    assert body["repo_url"] == REPO_URL
    assert body["name"] == "nightly"
    assert body["status"] == "queued"
    assert body["finding_count"] == 0
    assert len(fake_run_scan.calls) == 1
    assert fake_run_scan.calls[0] == (body["id"], REPO_URL)


async def test_create_scan_runs_background_scan_in_queued_order(client, fake_db, fake_run_scan):
    resp = client.post("/api/v1/scans", json={"repo_url": REPO_URL})

    assert resp.status_code == 201
    runs = await fake_db.get_scan_runs()
    assert len(runs) == 1
    assert runs[0]["id"] == resp.json()["id"]
    assert runs[0]["status"] == "queued"
    assert fake_run_scan.calls == [(runs[0]["id"], REPO_URL)]


async def test_create_scan_invalid_url_returns_400(client, fake_run_scan, fake_db):
    resp = client.post("/api/v1/scans", json={"repo_url": "https://evil.example.com/repo"})

    assert resp.status_code == 400
    assert "host not allowed" in resp.json()["detail"]
    assert fake_run_scan.calls == []
    assert await fake_db.get_scan_runs() == []


async def test_create_scan_duplicate_active_returns_409(client, fake_db, fake_run_scan):
    await fake_db.insert_scan_run(REPO_URL)

    resp = client.post("/api/v1/scans", json={"repo_url": REPO_URL})

    assert resp.status_code == 409
    assert fake_run_scan.calls == []


async def test_create_scan_completed_scan_does_not_conflict(client, fake_db):
    run = await fake_db.insert_scan_run(REPO_URL)
    await fake_db.update_scan_status(run["id"], "completed", score=90, grade="A")

    resp = client.post("/api/v1/scans", json={"repo_url": REPO_URL})

    assert resp.status_code == 201


def test_create_scan_missing_url_returns_422(client):
    resp = client.post("/api/v1/scans", json={})
    assert resp.status_code == 422


async def test_list_scans_returns_finding_count(client, fake_db):
    run_one = await fake_db.insert_scan_run("https://github.com/acme/one")
    run_two = await fake_db.insert_scan_run("https://github.com/acme/two")
    await fake_db.insert(
        "scan_findings",
        {
            "id": str(uuid.uuid4()),
            "scan_id": run_one["id"],
            "severity": "high",
            "category": "secrets",
            "rule_id": "SECRET_AWS_KEY",
            "file": "secrets.py",
            "line": 2,
            "evidence": "AKIA****",
            "description": "AWS Access Key",
        },
    )

    resp = client.get("/api/v1/scans")

    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    by_id = {row["id"]: row for row in data}
    assert by_id[run_one["id"]]["finding_count"] == 1
    assert by_id[run_two["id"]]["finding_count"] == 0


async def test_get_scan_returns_scan_and_findings(client, fake_db):
    run = await fake_db.insert_scan_run(REPO_URL, "acme")
    finding = await fake_db.insert(
        "scan_findings",
        {
            "id": str(uuid.uuid4()),
            "scan_id": run["id"],
            "severity": "critical",
            "category": "secrets",
            "rule_id": "SECRET_OPENAI_KEY",
            "file": "env.py",
            "line": 3,
            "evidence": "sk-****",
            "description": "OpenAI API key exposed in source",
            "remediation": "Revoke the key",
        },
    )

    resp = client.get(f"/api/v1/scans/{run['id']}")

    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == run["id"]
    assert body["repo_url"] == REPO_URL
    assert body["finding_count"] == 1
    assert len(body["findings"]) == 1
    assert body["findings"][0]["id"] == finding["id"]
    assert body["findings"][0]["severity"] == "critical"
    assert body["findings"][0]["file"] == "env.py"
    assert body["findings"][0]["promoted_to_incident"] is False


def test_get_scan_missing_returns_404(client):
    resp = client.get(f"/api/v1/scans/{uuid.uuid4()}")
    assert resp.status_code == 404


async def test_promote_finding_returns_201_and_sets_promoted_flag(client, fake_db):
    run = await fake_db.insert_scan_run(REPO_URL, "acme")
    finding_id = _finding_id_for("SECRET_AWS_KEY", "secrets.py", 7)
    await fake_db.insert(
        "scan_findings",
        {
            "id": finding_id,
            "scan_id": run["id"],
            "severity": "high",
            "category": "secrets",
            "rule_id": "SECRET_AWS_KEY",
            "file": "secrets.py",
            "line": 7,
            "evidence": "AKIA****",
            "description": "AWS Access Key",
            "remediation": "Rotate the key",
        },
    )

    resp = client.post(f"/api/v1/scans/{run['id']}/findings/{finding_id}/incident")

    assert resp.status_code == 201
    incident = resp.json()
    assert incident["title"] == "AWS Access Key in secrets.py"
    assert incident["severity"] == "high"
    assert incident["status"] == "open"
    assert incident["metadata"]["finding_id"] == finding_id
    assert incident["metadata"]["scan_id"] == run["id"]
    assert incident["metadata"]["repo_url"] == REPO_URL

    findings = await fake_db.get_scan_findings(run["id"])
    assert findings[0]["promoted_to_incident"] is True
    assert await fake_db.finding_has_incident(finding_id) is True


async def test_promote_finding_twice_returns_409(client, fake_db):
    run = await fake_db.insert_scan_run(REPO_URL)
    finding_id = _finding_id_for("SECRET_AWS_KEY", "secrets.py", 7)
    await fake_db.insert(
        "scan_findings",
        {
            "id": finding_id,
            "scan_id": run["id"],
            "severity": "high",
            "category": "secrets",
            "rule_id": "SECRET_AWS_KEY",
            "file": "secrets.py",
            "line": 7,
            "evidence": "AKIA****",
            "description": "AWS Access Key",
        },
    )

    first = client.post(f"/api/v1/scans/{run['id']}/findings/{finding_id}/incident")
    second = client.post(f"/api/v1/scans/{run['id']}/findings/{finding_id}/incident")

    assert first.status_code == 201
    assert second.status_code == 409
    assert second.json()["detail"] == "Finding already promoted to an incident"


async def test_promote_finding_of_another_scan_returns_404(client, fake_db):
    run_one = await fake_db.insert_scan_run("https://github.com/acme/one")
    run_two = await fake_db.insert_scan_run("https://github.com/acme/two")
    finding_id = _finding_id("https://github.com/acme/two", "SECRET_AWS_KEY", "secrets.py", 7)
    await fake_db.insert(
        "scan_findings",
        {
            "id": finding_id,
            "scan_id": run_two["id"],
            "severity": "high",
            "category": "secrets",
            "rule_id": "SECRET_AWS_KEY",
            "file": "secrets.py",
            "line": 7,
            "evidence": "AKIA****",
            "description": "AWS Access Key",
        },
    )

    resp = client.post(f"/api/v1/scans/{run_one['id']}/findings/{finding_id}/incident")

    assert resp.status_code == 404
    assert resp.json()["detail"] == "Finding not found"


async def test_promote_finding_missing_scan_returns_404(client, fake_db):
    resp = client.post(
        f"/api/v1/scans/{uuid.uuid4()}/findings/{uuid.uuid4()}/incident"
    )
    assert resp.status_code == 404
    assert resp.json()["detail"] == "Scan not found"


async def test_promote_finding_missing_finding_returns_404(client, fake_db):
    run = await fake_db.insert_scan_run(REPO_URL)
    resp = client.post(
        f"/api/v1/scans/{run['id']}/findings/{uuid.uuid4()}/incident"
    )
    assert resp.status_code == 404
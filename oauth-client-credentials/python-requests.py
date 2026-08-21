#!/usr/bin/env python3
"""Request an OAuth access token with client_credentials, then call the API."""

import os
import sys

import requests

TOKEN_URL = "https://auth.moffin.mx/public/auth/oauth2/token"
API_BASE = os.environ.get("MOFFIN_API", "https://sandbox.moffin.mx")
RESOURCE = os.environ.get("MOFFIN_RESOURCE", API_BASE)
CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")


def require_credentials():
    if not CLIENT_ID or not CLIENT_SECRET:
        sys.exit("Set CLIENT_ID and CLIENT_SECRET.")


def request_token():
    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "resource": RESOURCE,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=30,
    )
    if not response.ok:
        sys.exit(f"Token request failed: {response.status_code} {response.text}")
    return response.json()


def request_postal_code(access_token):
    response = requests.get(
        f"{API_BASE}/api/v1/postal-codes/44100",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=30,
    )
    if not response.ok:
        sys.exit(f"API request failed: {response.status_code} {response.text}")
    return response.json()


def main():
    require_credentials()
    token = request_token()
    print("token_type:", token.get("token_type"), "expires_in:", token.get("expires_in"))
    postal_codes = request_postal_code(token["access_token"])
    print(postal_codes)


if __name__ == "__main__":
    main()

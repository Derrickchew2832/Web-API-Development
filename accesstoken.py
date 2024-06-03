import requests

url = "https://test.api.amadeus.com/v1/security/oauth2/token"
headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}
data = {
    "grant_type": "client_credentials",
    "client_id": "wXcnvZ1kZuhDlPGMtmTS4oHotnsJyLZK",
    "client_secret": "JkxOBfPggJLtDwF7"
}

response = requests.post(url, headers=headers, data=data)
print(response.json())
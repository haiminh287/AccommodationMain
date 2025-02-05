
import requests
def search_location(address):
    BASE_URL = 'https://api.geoapify.com/v1/geocode/search'
    API_KEY = 'b4ae0c9325a44b20bcae811ba302d616'
    params = {
        'text': address,
        'apiKey': API_KEY
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()['features'][0]['properties']
    print(data)
    return data['lat'], data['lon']

# search_location("330 Cao Lo, Phường 4, Quận 8, Thành phố Hồ Chí Minh")

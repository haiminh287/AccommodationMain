from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from email.mime.text import MIMEText
import base64
import json
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
credentials_path = os.path.join(current_dir, 'credentials.json')
token_path = os.path.join(current_dir, 'token.json')
print(credentials_path)
def load_credentials():
    with open(credentials_path, mode='r') as creds_file:
        credentials_info = json.load(creds_file)['installed']
    with open(token_path, 'r') as token_file:
        token_info = json.load(token_file)
    return credentials_info, token_info

def save_token(creds):
    with open(token_path, 'w') as token_file:
        token_file.write(creds.to_json())

def get_gmail_service():
    credentials_info, token_info = load_credentials()
    creds = Credentials(
        token=token_info['access_token'],
        refresh_token=token_info['refresh_token'],
        token_uri=credentials_info['token_uri'],
        client_id=credentials_info['client_id'],
        client_secret=credentials_info['client_secret']
    )
    
    if creds.expired and creds.refresh_token:
        try:
            print("Refreshing token")
            creds.refresh(Request())
            save_token(creds)
        except Exception as e:
            print(f"An error occurred during token refresh: {e}")
            return None
    
    return build('gmail', 'v1', credentials=creds)

def create_message_html(from_address, to, subject, body, is_html=False):
    message = MIMEText(body, 'html' if is_html else 'plain')
    message['to'] = to
    message['from'] = from_address
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}

def create_message(sender, to, subject, message_text):
    message = MIMEText(message_text, 'html')
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes())
    raw = raw.decode()
    return {'raw': raw}

def send_email_notification(email, username, time, titleArticle, price, phone, location):
    try:
        service = get_gmail_service()
        if service is None:
            print("Failed to get Gmail service")
            return None
        
        subject = "Chủ Trọ " + username + " Đăng Bài Lúc " + time
        body = """
        <html>
        <body>
            <h1>Thông Tin Bài Đăng</h1>
            <h2>Thông Tin Liên Hệ:</h2>
            <p><strong>Số Điện Thoại:</strong> {phone}</p>
            <p><strong>Địa Chỉ:</strong> {location}</p>
            <h2>Thông Tin Bài Đăng:</h2>
            <p><strong>Tiêu Đề:</strong> {titleArticle}</p>
            <p><strong>Giá:</strong> {price}</p>
        </body>
        </html>
        """.format(phone=phone, location=location, titleArticle=titleArticle, price=price)
        
        to_address = email
        message = create_message("prolathe633@gmail.com", to_address, subject, body)
        sent_message = service.users().messages().send(userId="me", body=message).execute()
        print(f"Message sent. ID: {sent_message['id']}")
        return sent_message['id']
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
# send_email_notification("minhht2k4@gmail.com", "Minh", "2021-09-01 12:00:00", "Phòng Trọ Đẹp", "1.000.000", "0123456789", "Hà Nội")
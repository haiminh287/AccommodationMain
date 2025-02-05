from django.db.models.signals import post_save
from django.dispatch import receiver
from accommodations.models import AcquistionArticle, FollowUser,AddressHouseArticle
from accommodations.sendEmail import send_mail
from accommodations.services import search_location

@receiver(post_save, sender=AcquistionArticle)
def send_acquistion_notification(sender, instance, created, **kwargs):
    if created:
        print('send_acquistion_notification')
        try:
            latitude,longitude = search_location(instance.location)
            AddressHouseArticle.objects.create(house=instance,latitude=latitude,longitude=longitude)
            followers = FollowUser.objects.filter(followed_user=instance.user)
            if followers:
                for follower in followers:
                    print(follower.followed_user.email)
                    email = follower.followed_user.email
                    username = instance.user.username
                    print(username)
                    time = instance.created_at.strftime("%Y-%m-%d %H:%M:%S")
                    titleArticle = instance.title
                    price = instance.deposit
                    phone = instance.user.phone
                    location = instance.location
                    send_mail.send_email_notification(email, username, time, titleArticle, price, phone, location)

        except Exception as e:
            print(e)
            pass
        
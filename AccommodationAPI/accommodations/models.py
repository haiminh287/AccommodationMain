from django.db import models
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from phonenumber_field.modelfields import PhoneNumberField
from enum import Enum
from django.utils.translation import gettext_lazy

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class ApproveState(models.TextChoices):
    CANCEL = 'cc', gettext_lazy('Cancel')
    PENDING = 'pd', gettext_lazy('Pending')
    CONFIRM = 'cf', gettext_lazy('Confirm')


class HouseState(models.TextChoices):
    EMPTY = 'em', gettext_lazy('Con trong')
    EXECUTING = 'ex', gettext_lazy('Dang xu li')
    NO_SPACE = 'ns', gettext_lazy('Khong con cho')


class TypeAcquisition(models.TextChoices):
    RENT = 'ren', gettext_lazy('Cho thue')
    BUY = 'buy', gettext_lazy('Mua')
    ORDER = 'odr', gettext_lazy('Dat truoc')


class TypeHouse(models.TextChoices):
    APARTMENT = 'apar', gettext_lazy("Can ho")
    HOME = 'home', gettext_lazy('Nha rieng')
    VILLA = 'vill', gettext_lazy('Biet thu')
    STREET_HOUSE = 'strh', gettext_lazy('Nha mac pho')
    SHOP_HOUSE = 'shph', gettext_lazy('Shop')
    OFFICE = 'offc', gettext_lazy('Nha van phong')
    FACTORY = 'fact', gettext_lazy('Nha xuong')
    OTHER = 'othr', gettext_lazy('Nha loai khac')


class TypeOwnership(models.TextChoices):
    FULL = 'full', gettext_lazy('Nguyen can')
    PART = 'part', gettext_lazy('Mot phan')
    ROOM = 'room', gettext_lazy('Mot phong')
    FLOOR = 'flor', gettext_lazy('Mot tang')


class InteriorState(models.TextChoices):
    NOT_YET = 'noye', gettext_lazy('Chua co')
    HAVE = 'have', gettext_lazy('Da co')

class UserEnum(Enum):
    INKEEPER = "Chủ Nhà Trọ"
    TENANT = "Người Tìm Trọ"
    ADMIN = "Quản Trị Viên"
    # BROKER = "Môi Giới"

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=True)
    phone = PhoneNumberField(null=True)
    user_role = models.CharField(max_length=100, choices=UserEnum.choices(), default=UserEnum.TENANT.value)

class ArticleStateEnum(Enum):
    PENDING = 'Chờ Kiểm Duyệt'
    DONE = 'Đã Duyệt'
    CANCEL = 'Đã Hủy'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

class Article(BaseModel):
    title = models.CharField(max_length=256)
    content = models.TextField()

    class Meta:
        abstract = True

class HouseArticle(Article):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contact = models.CharField(max_length=100)
    location = models.CharField(max_length=256)
    state = models.CharField(max_length=100, choices=ArticleStateEnum.choices(), default=ArticleStateEnum.PENDING.name)


class AddressHouseArticle(models.Model):
    house = models.ForeignKey("AcquistionArticle", on_delete=models.CASCADE)
    longitude = models.DecimalField(max_digits=30, decimal_places=14)
    latitude = models.DecimalField(max_digits=30, decimal_places=14)

class ImageHouse(models.Model):
    house = models.ForeignKey(HouseArticle, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='house/%Y/%m/', null=True)

class HouseBonusInfo(models.Model):
    house_state = models.CharField(max_length=2, null=True, choices=HouseState.choices)
    type_acquisition = models.CharField(max_length=3, null=True, choices=TypeAcquisition.choices)
    type_house = models.CharField(max_length=4, null=True, choices=TypeHouse.choices)
    type_ownership = models.CharField(max_length=4, null=True, choices=TypeOwnership.choices)
    interior_state = models.CharField(max_length=4, null=True, choices=InteriorState.choices)

    class Meta:
        abstract = True


class AcquistionArticle(HouseBonusInfo,HouseArticle):
    stateAcqui = models.BooleanField(default=True)
    deposit = models.DecimalField(max_digits=10, decimal_places=2)
    number_people = models.IntegerField( blank=True)
    area = models.CharField(max_length=100)
    district = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    
    house_state = models.CharField(max_length=2, null=False, choices=HouseState.choices, default=HouseState.EMPTY)
    type_acquisition = models.CharField(max_length=3, null=False, choices=TypeAcquisition.choices, default=TypeAcquisition.RENT)
    typeHouse = models.CharField(max_length=4, null=False, choices=TypeHouse.choices, default=TypeHouse.HOME)
    type_ownership = models.CharField(max_length=4, null=False, choices=TypeOwnership.choices, default=TypeOwnership.FULL)
    interior_state = models.CharField(max_length=4, null=False, choices=InteriorState.choices, default=InteriorState.NOT_YET)

class LookingArticle(HouseBonusInfo,HouseArticle):
    looking_state = models.BooleanField(default=True)
    number_people = models.IntegerField(null=True, blank=True)
    deposit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    area = models.CharField(max_length=256,null=True, blank=True)

class AddtionallInfomaion(models.Model):
    house = models.ForeignKey(AcquistionArticle, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    value = models.CharField(max_length=256)
    icon = models.CharField(max_length=10, default='tag')
    def __str__(self):
        return self.name





class Conversation(BaseModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_conversations')
    user_receiver = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='received_conversations')

    def __str__(self):
        return f"Conversation between {self.owner.username} and {self.user_receiver.username}"

class ConversationChat(BaseModel):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='chats')
    content = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats')

    def __str__(self):
        return f"{self.user.username} in conversation {self.conversation.owner.username}"

class Notification(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}"


class FollowUser(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    followed_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')

    class Meta:
        unique_together = ('user', 'followed_user')

    def __str__(self):
        return f"{self.user.username} followed {self.followed_user.username}"

class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    house = models.ForeignKey(HouseArticle, on_delete=models.CASCADE,null=True)
    class Meta:
        abstract = True

class Comment(Interaction):
    content = models.TextField()

    def __str__(self):
        return f"Comment from {self.user.username} for {self.house.title}"

class Like(Interaction):
    class Meta:
        unique_together = ('user', 'house')
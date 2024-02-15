from rest_framework.pagination import PageNumberPagination


class UserInfinitePagination(PageNumberPagination):
    page_size = 10

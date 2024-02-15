from rest_framework.pagination import PageNumberPagination


class DeckInfiniteScrollPagination(PageNumberPagination):
    page_size = 6

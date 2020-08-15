import feedparser


def parse(url):
    parsed = feedparser.parse(url)
    if parsed.feed:
        return parsed
    else:
        return False


def get_feed(parsed):
    feed = parsed['feed']
    return {
        'link': feed['link'],
        'title': feed['title'],
        'subtitle': feed['subtitle'],
    }


def get_articles(parsed):
    articles = []
    entries = parsed['entries']
    for entry in entries:
        articles.append({
            'id': entry.get('id', ''),
            'link': entry.get('link', ''),
            'title': entry.get('title', 'Sin titulo'),
            'summary': entry.get('summary', 'Sin Resumen'),
            'published': entry.get('published_parsed', '')
        })
    return articles

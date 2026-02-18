"""
Fetch YouTube video data via the Data API v3 and save as a static JSON file.
Runs in GitHub Actions with the API key stored as a secret.
The static site reads the JSON — no API key in the browser.
"""

import urllib.request
import json
import os
import re
import sys
from datetime import datetime, timezone

API_KEY = os.environ.get('YOUTUBE_API_KEY')
if not API_KEY:
    print('ERROR: YOUTUBE_API_KEY environment variable not set')
    sys.exit(1)

CHANNEL_ID = 'UCjU5frJrfgcQP3OwrU16I7g'
UPLOADS_PLAYLIST = 'UUjU5frJrfgcQP3OwrU16I7g'
INTERVIEWS_PLAYLIST = 'PL80OZ9pWM1bCCwUpk182E4xCHfh6lKUY_'

def api_get(url):
    """Fetch a YouTube API URL and return parsed JSON."""
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode('utf-8'))

def parse_duration(iso):
    """Convert ISO 8601 duration (PT1H2M3S) to seconds."""
    m = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', iso or '')
    if not m:
        return 0
    return int(m.group(1) or 0) * 3600 + int(m.group(2) or 0) * 60 + int(m.group(3) or 0)

def fetch_playlist_video_ids(playlist_id, max_pages=5):
    """Fetch all video IDs from a playlist (up to max_pages * 50)."""
    ids = []
    page_token = ''
    for _ in range(max_pages):
        url = (
            f'https://www.googleapis.com/youtube/v3/playlistItems'
            f'?part=snippet&playlistId={playlist_id}&maxResults=50'
            f'&key={API_KEY}'
        )
        if page_token:
            url += f'&pageToken={page_token}'
        data = api_get(url)
        for item in data.get('items', []):
            vid = item['snippet']['resourceId']['videoId']
            ids.append(vid)
        page_token = data.get('nextPageToken', '')
        if not page_token:
            break
    return ids

def fetch_video_details(video_ids):
    """Fetch full details (snippet, stats, contentDetails, liveStreamingDetails) in batches of 50."""
    videos = []
    for i in range(0, len(video_ids), 50):
        batch = ','.join(video_ids[i:i+50])
        url = (
            f'https://www.googleapis.com/youtube/v3/videos'
            f'?part=snippet,statistics,contentDetails,liveStreamingDetails'
            f'&id={batch}&key={API_KEY}'
        )
        data = api_get(url)
        videos.extend(data.get('items', []))
    return videos

def is_live_or_premiere(video):
    """Check if a video is/was a live stream or premiere."""
    broadcast = video.get('snippet', {}).get('liveBroadcastContent', 'none')
    if broadcast in ('live', 'upcoming'):
        return True
    if 'liveStreamingDetails' in video:
        return True
    return False

def is_short(video, duration_secs):
    """Detect YouTube Shorts: title contains #shorts OR duration <= 60s."""
    title = video.get('snippet', {}).get('title', '').lower()
    if '#shorts' in title or '#short' in title:
        return True
    if duration_secs <= 60:
        return True
    return False

def video_to_dict(video, is_short=False):
    """Convert an API video object to a clean dict for JSON output."""
    snippet = video['snippet']
    stats = video.get('statistics', {})
    thumb = snippet.get('thumbnails', {})
    # Prefer medium, then high, then default
    thumb_url = (thumb.get('medium') or thumb.get('high') or thumb.get('default', {})).get('url', '')

    return {
        'id': video['id'],
        'title': snippet.get('title', ''),
        'thumbnail': thumb_url,
        'views': int(stats.get('viewCount', 0)),
        'published': snippet.get('publishedAt', ''),
        'is_short': is_short,
    }

def main():
    print('Fetching uploads playlist...')
    upload_ids = fetch_playlist_video_ids(UPLOADS_PLAYLIST)
    print(f'  Found {len(upload_ids)} uploads')

    print('Fetching video details...')
    all_videos = fetch_video_details(upload_ids)
    print(f'  Got details for {len(all_videos)} videos')

    # Split into shorts, full-length, and exclude lives
    shorts = []
    full_length = []
    excluded = 0

    for v in all_videos:
        if is_live_or_premiere(v):
            excluded += 1
            continue

        duration = parse_duration(v.get('contentDetails', {}).get('duration', ''))
        if is_short(v, duration):
            shorts.append(video_to_dict(v, is_short=True))
        else:
            full_length.append(video_to_dict(v, is_short=False))

    print(f'  Full-length: {len(full_length)}, Shorts: {len(shorts)}, Excluded (live): {excluded}')

    # Sort by view count descending
    full_length.sort(key=lambda v: v['views'], reverse=True)
    shorts.sort(key=lambda v: v['views'], reverse=True)

    # Fetch interviews playlist
    print('Fetching interviews playlist...')
    interview_ids = fetch_playlist_video_ids(INTERVIEWS_PLAYLIST)
    print(f'  Found {len(interview_ids)} interview videos')

    interview_videos = fetch_video_details(interview_ids)
    interviews = []
    for v in interview_videos:
        interviews.append(video_to_dict(v, is_short=False))
    interviews.sort(key=lambda v: v['views'], reverse=True)

    output = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'full_length': full_length,
        'shorts': shorts,
        'interviews': interviews,
    }

    os.makedirs('data', exist_ok=True)
    with open('data/youtube.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f'\nSaved data/youtube.json')
    print(f'  {len(full_length)} full-length videos')
    print(f'  {len(shorts)} shorts')
    print(f'  {len(interviews)} interviews')

if __name__ == '__main__':
    main()

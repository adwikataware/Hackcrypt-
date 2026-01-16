from media_downloader import download_video

# Test with a short YouTube video
url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

print("Testing media downloader...")
print(f"URL: {url}")
print()

result = download_video(url, max_duration=10)

if result['success']:
    print("✅ SUCCESS!")
    print(f"Video Path: {result['video_path']}")
    print(f"Metadata: {result['metadata']}")
else:
    print("❌ FAILED!")
    print(f"Error: {result['error']}")

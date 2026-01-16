from media_downloader import download_video

# NASA tweet with actual video
url = "https://twitter.com/SpaceX/status/1800000000000000000"

print("Testing Twitter download...")
print(f"URL: {url}")
print()

result = download_video(url, max_duration=30)

if result['success']:
    print("✅ SUCCESS!")
    print(f"Video Path: {result['video_path']}")
    print(f"Metadata: {result['metadata']}")
else:
    print("❌ FAILED!")
    print(f"Error: {result['error']}")

import logging
import os
import tempfile

from moviepy.editor import VideoFileClip

from src.worker import s3_storage

logger = logging.getLogger(__name__)


def extract_audio_from_video(video_url: str, media_id: str) -> tuple[str, dict]:
    """
    Extract audio from video file and upload to S3.

    Args:
        video_url: URL of the video file (HTTP or S3)
        media_id: Unique media ID for naming

    Returns:
        tuple: (audio_s3_url, video_metadata)

    Raises:
        Exception: If conversion fails
    """
    temp_files = []

    try:
        # Create temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            logger.info(f"Temporary directory created: {temp_dir}")

            # Determine file paths
            video_path = os.path.join(temp_dir, f"{media_id}_video.mp4")
            audio_path = os.path.join(temp_dir, f"{media_id}_audio.mp3")

            temp_files.extend([video_path, audio_path])

            # Download video file
            logger.info(f"Downloading video from {video_url}")

            if video_url.startswith("s3://"):
                # Parse S3 URL and download
                bucket, key = s3_storage.parse_s3_url(video_url)
                s3_storage.download_file(key, video_path)
            else:
                # Handle HTTP URLs
                import requests

                response = requests.get(video_url, timeout=60, stream=True)
                response.raise_for_status()

                with open(video_path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)

            logger.info(f"Video downloaded: {video_path}")

            # Extract video metadata using moviepy
            logger.info("Extracting video metadata...")

            with VideoFileClip(video_path) as clip:
                metadata = {
                    "duration": clip.duration,
                    "fps": clip.fps,
                    "width": clip.w,
                    "height": clip.h,
                    "size": clip.size,
                    "has_audio": clip.audio is not None,
                }

                logger.info(f"Video metadata: {metadata}")

                # Check if video has audio
                if not clip.audio:
                    raise ValueError("Video file has no audio track to extract")

                # Extract audio to MP3
                logger.info(f"Extracting audio to MP3: {audio_path}")

                audio_clip = clip.audio
                audio_clip.write_audiofile(
                    audio_path, verbose=False, logger=None, codec="mp3", bitrate="192k"
                )
                audio_clip.close()

                logger.info("Audio extraction completed")

            # Verify audio file was created
            if not os.path.exists(audio_path):
                raise RuntimeError("Audio extraction failed - no audio file created")

            # Get audio file info
            audio_size = os.path.getsize(audio_path)
            logger.info(f"Audio file size: {audio_size} bytes")

            # Upload extracted audio to S3
            audio_s3_key = f"converted/{media_id}/audio.mp3"
            audio_s3_url = s3_storage.upload_file(audio_path, audio_s3_key)

            logger.info(f"Audio uploaded to S3: {audio_s3_url}")

            return audio_s3_url, metadata

    except Exception as e:
        logger.error(f"Error extracting audio from video {video_url}: {e}")

        # Clean up any created temp files
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                    logger.info(f"Cleaned up temp file: {temp_file}")
                except Exception as cleanup_error:
                    logger.warning(
                        f"Failed to clean up temp file {temp_file}: {cleanup_error}"
                    )

        raise


def get_video_metadata(video_url: str) -> dict:
    """
    Get video metadata without extracting audio.

    Args:
        video_url: URL of the video file

    Returns:
        Dictionary with video metadata
    """
    temp_video_path = None

    try:
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
            temp_video_path = temp_file.name

        # Download video file
        if video_url.startswith("s3://"):
            bucket, key = s3_storage.parse_s3_url(video_url)
            s3_storage.download_file(key, temp_video_path)
        else:
            import requests

            response = requests.get(video_url, timeout=60, stream=True)
            response.raise_for_status()

            with open(temp_video_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

        # Extract metadata
        with VideoFileClip(temp_video_path) as clip:
            metadata = {
                "duration": clip.duration,
                "fps": clip.fps,
                "width": clip.w,
                "height": clip.h,
                "size": clip.size,
                "has_audio": clip.audio is not None,
            }

        return metadata

    except Exception as e:
        logger.error(f"Error getting video metadata from {video_url}: {e}")
        raise

    finally:
        # Clean up temp file
        if temp_video_path and os.path.exists(temp_video_path):
            try:
                os.remove(temp_video_path)
            except Exception as e:
                logger.warning(f"Failed to clean up temp file {temp_video_path}: {e}")


def is_supported_video_format(url: str) -> bool:
    """
    Check if video format is supported for conversion.

    Args:
        url: URL of the video file

    Returns:
        True if format is supported, False otherwise
    """
    supported_extensions = {
        ".mp4",
        ".avi",
        ".mov",
        ".mkv",
        ".wmv",
        ".flv",
        ".webm",
        ".mpeg",
        ".mpg",
        ".3gp",
        ".ogv",
        ".m4v",
    }

    from urllib.parse import urlparse

    parsed = urlparse(url)
    path = parsed.path
    extension = os.path.splitext(path)[1].lower()

    return extension in supported_extensions

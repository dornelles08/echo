import logging
from urllib.parse import urlparse

from botocore.exceptions import ClientError

from src.worker import config

logger = logging.getLogger(__name__)

_s3_client = None


def get_s3_client():
    """Initialize and return S3 client with MinIO configuration."""
    global _s3_client
    if _s3_client is None:
        import boto3

        _s3_client = boto3.client(
            "s3",
            endpoint_url=config.S3_ENDPOINT_URL,
            aws_access_key_id=config.S3_ACCESS_KEY_ID,
            aws_secret_access_key=config.S3_SECRET_ACCESS_KEY,
            region_name=config.S3_REGION,
        )
        logger.info(f"S3 client initialized with endpoint: {config.S3_ENDPOINT_URL}")
    return _s3_client


def upload_file(file_path: str, object_key: str) -> str:
    """
    Upload file to S3/MinIO and return S3 URL.

    Args:
        file_path: Local path to file
        object_key: S3 object key (path within bucket)

    Returns:
        S3 URL of uploaded file
    """
    try:
        s3 = get_s3_client()
        logger.info(
            f"Uploading {file_path} to s3://{config.S3_BUCKET_NAME}/{object_key}"
        )

        s3.upload_file(file_path, config.S3_BUCKET_NAME, object_key)

        s3_url = f"s3://{config.S3_BUCKET_NAME}/{object_key}"
        logger.info(f"File uploaded successfully: {s3_url}")

        return s3_url

    except Exception as e:
        logger.error(f"Error uploading file {file_path} to S3: {e}")
        raise


def download_file(object_key: str, local_path: str) -> None:
    """
    Download file from S3/MinIO.

    Args:
        object_key: S3 object key
        local_path: Local path to save file
    """
    try:
        s3 = get_s3_client()
        logger.info(
            f"Downloading s3://{config.S3_BUCKET_NAME}/{object_key} to {local_path}"
        )

        s3.download_file(config.S3_BUCKET_NAME, object_key, local_path)

        logger.info(f"File downloaded successfully: {local_path}")

    except Exception as e:
        logger.error(f"Error downloading file {object_key} from S3: {e}")
        raise


def delete_file(object_key: str) -> bool:
    """
    Delete file from S3/MinIO.

    Args:
        object_key: S3 object key to delete

    Returns:
        True if deleted successfully, False otherwise
    """
    try:
        s3 = get_s3_client()
        logger.info(f"Deleting s3://{config.S3_BUCKET_NAME}/{object_key}")

        s3.delete_object(Bucket=config.S3_BUCKET_NAME, Key=object_key)

        logger.info(
            f"File deleted successfully: s3://{config.S3_BUCKET_NAME}/{object_key}"
        )
        return True

    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            logger.warning(
                f"File not found for deletion: s3://{config.S3_BUCKET_NAME}/{object_key}"
            )
            return True  # Consider success if file doesn't exist
        else:
            logger.error(f"Error deleting file {object_key} from S3: {e}")
            return False
    except Exception as e:
        logger.error(f"Error deleting file {object_key}: {e}")
        return False


def parse_s3_url(s3_url: str) -> tuple[str, str]:
    """
    Parse S3 URL into bucket and key.

    Args:
        s3_url: S3 URL in format s3://bucket/key

    Returns:
        Tuple of (bucket, key)
    """
    if not s3_url.startswith("s3://"):
        raise ValueError(f"Invalid S3 URL: {s3_url}")

    parsed = urlparse(s3_url)
    bucket = parsed.netloc
    key = parsed.path.lstrip("/")

    return bucket, key


def generate_presigned_url(object_key: str, expiration: int = 3600) -> str:
    """
    Generate presigned URL for S3 object.

    Args:
        object_key: S3 object key
        expiration: URL expiration time in seconds (default: 1 hour)

    Returns:
        Presigned URL
    """
    try:
        s3 = get_s3_client()

        response = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": config.S3_BUCKET_NAME, "Key": object_key},
            ExpiresIn=expiration,
        )

        return response

    except Exception as e:
        logger.error(f"Error generating presigned URL for {object_key}: {e}")
        raise


def file_exists(object_key: str) -> bool:
    """
    Check if file exists in S3/MinIO.

    Args:
        object_key: S3 object key

    Returns:
        True if file exists, False otherwise
    """
    try:
        s3 = get_s3_client()
        s3.head_object(Bucket=config.S3_BUCKET_NAME, Key=object_key)
        return True
    except ClientError as e:
        if e.response["Error"]["Code"] == "404":
            return False
        else:
            logger.error(f"Error checking if file {object_key} exists: {e}")
            return False
    except Exception as e:
        logger.error(f"Error checking file existence: {e}")
        return False

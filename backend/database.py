import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING, DESCENDING

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "cropcare_db")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not configured in .env")


client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000
)

db = client[MONGODB_DATABASE]

# MongoDB automatically creates these collections
# when indexes/data are created.
users_collection = db["users"]
advisories_collection = db["advisories"]


def initialize_database():
    """
    Creates database collections and indexes automatically.
    No manual collection creation is required in MongoDB Atlas.
    """

    print()
    print("=" * 60)
    print("INITIALIZING MONGODB")
    print("=" * 60)

    # Test connection
    client.admin.command("ping")

    # Create indexes automatically
    users_collection.create_index(
        [("email", ASCENDING)],
        unique=True
    )

    advisories_collection.create_index(
        [("user_id", ASCENDING), ("created_at", DESCENDING)]
    )

    print("MongoDB Atlas connected successfully.")
    print(f"Database: {MONGODB_DATABASE}")
    print("Collection: users")
    print("Collection: advisories")
    print("Indexes initialized successfully.")
    print("=" * 60)


def get_database_stats():
    """
    Returns basic database information.
    """

    return {
        "users": users_collection.count_documents({}),
        "advisories": advisories_collection.count_documents({})
    }


def current_time():
    return datetime.now(timezone.utc)

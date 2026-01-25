import os

import uvicorn

from app.main import app

if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    if os.environ.get("APP_ENV") == "development":
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
    else:
        uvicorn.run(app, host="0.0.0.0", port=8000)

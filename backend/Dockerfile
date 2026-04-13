# ------------------------
# builder stage
# ------------------------
FROM python:3.11-slim AS builder
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir --target=/python -r requirements.txt

COPY . .

# ------------------------
# runtime stage (distroless)
# ------------------------
FROM gcr.io/distroless/python3-debian12:nonroot
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    WEB_CONCURRENCY=2 \
    PYTHONPATH=/python:/app \
    TMPDIR=/app/tmp \
    TEMP=/app/tmp \
    TMP=/app/tmp \
    XDG_CACHE_HOME=/app/tmp/.cache

COPY --from=builder /python /python
COPY --from=builder /app /app

EXPOSE 8000

CMD ["-m","gunicorn","api:app","-k","uvicorn.workers.UvicornWorker","-w","2","-b","0.0.0.0:8000","--control-socket","/tmp/gunicorn.ctl"]

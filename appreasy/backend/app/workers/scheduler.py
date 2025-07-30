from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from ..db.session import AsyncSessionLocal
from ..etl import linz
from datetime import datetime, timedelta
import asyncio

scheduler = AsyncIOScheduler()

@scheduler.scheduled_job(CronTrigger(hour="2", minute="0"))
async def nightly_refresh():
    print("Starting nightly data refresh...")
    async with AsyncSessionLocal() as sess:
        one_day = datetime.utcnow() - timedelta(days=1)
        await linz.load_parcels(sess, since=one_day)
        print("Nightly refresh completed")

async def start_scheduler():
    scheduler.start()
    print("Scheduler started")

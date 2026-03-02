import os
import asyncio
from telethon import TelegramClient

api_id = int(os.environ.get("API_ID"))
api_hash = os.environ.get("API_HASH")

contacts_and_messages = [
    ("@QingBaoJuXuanwubot", "/sign")
]

async def send_messages():
    client = TelegramClient(f"/tmp/session_{api_id}", api_id, api_hash)

    try:
        await client.start()
    except Exception as e:
        print(f"连接失败: {e}")
        return

    for contact, message in contacts_and_messages:
        await client.send_message(contact, message)
        await asyncio.sleep(5)
        await client.send_read_acknowledge(contact)

        messages = await client.get_messages(contact, limit=1)
        if messages:
            print(f"Last message from {contact}: {messages[0].text}")

    await client.disconnect()

async def main():
    await send_messages()

if __name__ == "__main__":
    asyncio.run(main())

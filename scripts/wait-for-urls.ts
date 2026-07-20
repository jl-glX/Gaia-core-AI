const urls = process.argv.slice(2);
const timeoutMs = Number.parseInt(process.env.WAIT_TIMEOUT_MS ?? "60000", 10);
const retryDelayMs = 500;

if (urls.length === 0) {
  throw new Error("Provide at least one URL to wait for");
}

async function isReachable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(2_000),
    });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForUrl(url: string): Promise<void> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isReachable(url)) {
      console.log(`Ready: ${url}`);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

await Promise.all(urls.map(waitForUrl));

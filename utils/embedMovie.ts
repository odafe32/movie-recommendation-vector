// utils/embedMovie.ts

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
    object: string;
  }>;
  model: string;
  object: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

interface EmbeddingError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

// Simple in-memory cache to avoid redundant API calls
const embeddingCache = new Map<string, number[]>();

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

// Sleep utility for delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Rate limiting function
async function rateLimitedDelay() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const delayTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await sleep(delayTime);
  }

  lastRequestTime = Date.now();
}

export async function embedding(
  prompt: string,
  options: {
    maxRetries?: number;
    useCache?: boolean;
    model?: string;
    dimensions?: number;
  } = {}
): Promise<number[]> {
  const {
    maxRetries = 3,
    useCache = true,
    model = "text-embedding-3-large",
    dimensions = 512,
  } = options;

  // Check cache first
  if (useCache && embeddingCache.has(prompt)) {
    console.log("Using cached embedding for prompt");
    return embeddingCache.get(prompt)!;
  }

  // Validate API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Apply rate limiting
      await rateLimitedDelay();

      console.log(
        `Embedding attempt ${attempt + 1}/${
          maxRetries + 1
        } for prompt: ${prompt.substring(0, 50)}...`
      );

      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          input: prompt,
          model,
          dimensions,
        }),
      });

      // Handle different HTTP status codes
      if (response.status === 429) {
        // Rate limited - extract retry-after header if available
        const retryAfter = response.headers.get("retry-after");
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, attempt) * 1000;

        console.warn(
          `Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${
            maxRetries + 1
          }`
        );

        if (attempt < maxRetries) {
          await sleep(waitTime);
          continue;
        } else {
          throw new Error(
            `Rate limit exceeded after ${
              maxRetries + 1
            } attempts. Please check your OpenAI quota and billing details.`
          );
        }
      }

      if (response.status === 401) {
        throw new Error(
          "Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable."
        );
      }

      if (response.status === 400) {
        const errorData: EmbeddingError = await response.json();
        throw new Error(
          `Bad request: ${
            errorData.error?.message || "Invalid request parameters"
          }`
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
      }

      const result: EmbeddingResponse = await response.json();

      // Validate response structure
      if (
        !result.data ||
        !Array.isArray(result.data) ||
        result.data.length === 0
      ) {
        throw new Error("Invalid response structure from OpenAI API");
      }

      if (
        !result.data[0].embedding ||
        !Array.isArray(result.data[0].embedding)
      ) {
        throw new Error("No embedding data received from OpenAI API");
      }

      const embeddingVector = result.data[0].embedding;

      // Cache the result
      if (useCache) {
        embeddingCache.set(prompt, embeddingVector);
      }

      console.log(
        `Successfully generated embedding with ${embeddingVector.length} dimensions`
      );
      return embeddingVector;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on certain errors
      if (
        lastError.message.includes("Invalid OpenAI API key") ||
        lastError.message.includes("Bad request")
      ) {
        throw lastError;
      }

      console.error(
        `Embedding attempt ${attempt + 1} failed:`,
        lastError.message
      );

      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const backoffTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Waiting ${backoffTime}ms before next attempt...`);
        await sleep(backoffTime);
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw new Error(
    `Failed to generate embedding after ${
      maxRetries + 1
    } attempts. Last error: ${lastError?.message}`
  );
}

// Utility function to clear cache if needed
export function clearEmbeddingCache(): void {
  embeddingCache.clear();
  console.log("Embedding cache cleared");
}

// Utility function to get cache size
export function getEmbeddingCacheSize(): number {
  return embeddingCache.size;
}

// Batch embedding function for multiple prompts
export async function batchEmbedding(
  prompts: string[],
  options: {
    maxRetries?: number;
    useCache?: boolean;
    model?: string;
    dimensions?: number;
    batchSize?: number;
  } = {}
): Promise<number[][]> {
  const { batchSize = 5, ...embeddingOptions } = options;
  const results: number[][] = [];

  // Process in batches to avoid overwhelming the API
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        prompts.length / batchSize
      )}`
    );

    const batchPromises = batch.map((prompt) =>
      embedding(prompt, embeddingOptions)
    );
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches
    if (i + batchSize < prompts.length) {
      await sleep(2000); // 2 second delay between batches
    }
  }

  return results;
}

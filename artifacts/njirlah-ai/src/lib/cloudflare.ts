export interface CloudflareModel {
  id: string;
  name: string;
  description?: string;
  task?: { name: string };
}

export async function fetchCloudflareModels(): Promise<CloudflareModel[]> {
  const response = await fetch(`/api/cloudflare/models`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Cloudflare models: ${response.status}`);
  }
  const data = (await response.json()) as { models: CloudflareModel[] };
  return data.models || [];
}

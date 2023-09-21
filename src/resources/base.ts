type RegionCode = 'LON1' | 'NYC1';

export type Config = {
  apiKey: string;
  regionCode?: RegionCode;
};

export abstract class Base {
  private apiKey: string;
  private regionCode: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.regionCode = config.regionCode || 'LON1';
  }

  protected request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = new URL(`https://api.civo.com/v2${endpoint}`);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const config = {
      ...options,
      headers,
    };

    return fetch(url.toString(), config).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    });
  }
}

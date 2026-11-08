
import { Injectable } from '@angular/core';

export interface Advertisement {
  id: string;
  title: string;
  sponsorName: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  placement: string;
  targetDistrict: string;
  startDate: string;
  endDate: string;
  status: string;
  viewCount: number;
  clickCount: number;
  createdAt: string;
}

export interface CreateAdvertisement {
  title: string;
  sponsorName: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  placement: string;
  targetDistrict: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvertisementApiService {

  private readonly apiUrl =
    'http://localhost:5055/api/advertisements';

  private async request<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    });

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        message || `API Error ${response.status}`
      );
    }

    return response.json() as Promise<T>;
  }

  getAll(): Promise<Advertisement[]> {
    return this.request<Advertisement[]>(
      this.apiUrl
    );
  }

  getActive(): Promise<Advertisement[]> {
    return this.request<Advertisement[]>(
      `${this.apiUrl}/active`
    );
  }

  create(
    advertisement: CreateAdvertisement
  ): Promise<Advertisement> {

    return this.request<Advertisement>(
      this.apiUrl,
      {
        method: 'POST',
        body: JSON.stringify(advertisement)
      }
    );
  }

  changeStatus(
    id: string,
    status: 'Active' | 'Paused' | 'Archived'
  ): Promise<Advertisement> {

    return this.request<Advertisement>(
      `${this.apiUrl}/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }
    );
  }

  async uploadImage(file: File): Promise<string> {

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(
      `${this.apiUrl}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(
        await response.text()
      );
    }

    const result = await response.json() as {
      imageUrl: string;
    };

    if (!result.imageUrl) {
      throw new Error('Image URL missing.');
    }

    return result.imageUrl;
  }
}

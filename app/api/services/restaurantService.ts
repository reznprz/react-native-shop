import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { Platform } from 'react-native';

export type CrossFile = File | { uri: string; name: string; type: string };

export interface RestaurantData {
  id: number;
  restaurantName: string;
  description: string;
  imageUrl: string;
  emails: RestaurantEmail[];
  phones: RestaurantPhone[];
  subscriptionSummary?: RestaurantSubscriptionSummary;
}

export interface RestaurantEmail {
  id: number;
  email: string;
  status: ContactStatus;
}

export interface ContactRequestDto {
  /** Omit for new; include for updates */
  id?: number;
  type: ContactType;
  value: string;
  status?: ContactStatus;
}

export interface RestaurantPhone {
  id: number;
  phoneNumber: string;
  status: ContactStatus;
}

export enum ContactStatus {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ContactType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface PlanFeatureSummary {
  featureName: string;
  enabled: boolean;
}

export interface PlanSummary {
  planName: string;
  monthlyCost: number;
  yearlyCost: number;
  features: PlanFeatureSummary[];
}

export interface RestaurantSubscriptionSummary {
  status: SubscriptionStatus;
  plan: PlanSummary;
}

export const getRestaurantApi = async (
  restaurantId: number,
): Promise<ApiResponse<RestaurantData>> => {
  return await apiMethods.get<RestaurantData>(`/api/restaurants/${restaurantId}`);
};

export const getSubscriptionPlansApi = async (): Promise<
  ApiResponse<Record<string, PlanSummary>>
> => {
  return await apiMethods.get<Record<string, PlanSummary>>(`/api/restaurants/subscriptionPlans`);
};

// Add or update a single contact
export const upsertContactApi = (
  restaurantId: number,
  payload: ContactRequestDto,
): Promise<ApiResponse<RestaurantData>> =>
  apiMethods.post<RestaurantData>(`/api/restaurants/${restaurantId}/contacts`, payload);

// Delete a single contact and return the updated restaurant
export const deleteContactApi = (
  restaurantId: number,
  type: ContactType,
  contactId: number,
): Promise<ApiResponse<RestaurantData>> =>
  apiMethods.delete<RestaurantData>(
    `/api/restaurants/${restaurantId}/contacts/${type}/${contactId}`,
  );


/**
 * PUT /api/restaurants/{id}
 * Sends the JSON dto in part “data” and (optionally) the image in part “file”.
 */

export const updateRestaurantApi = async (
  restaurantId: number,
  updatedRestaurant: RestaurantData,
  file?: CrossFile,
): Promise<ApiResponse<RestaurantData>> => {
  const url = `/api/restaurants/${restaurantId}`;
  const fd = new FormData();

  // Part "data" (as string; backend parses with ObjectMapper)
  fd.append('data', JSON.stringify(updatedRestaurant));

  // Part "file"
  if (file) {
    if (Platform.OS === 'web') {
      const maybeUri = (file as any).uri as string | undefined;

      if (maybeUri?.startsWith?.('blob:')) {
        // Convert blob: URL → real File
        const res = await fetch(maybeUri);
        const blob = await res.blob();
        const webFile = new File(
          [blob],
          (file as any).name || 'upload.jpg',
          { type: (file as any).type || blob.type || 'application/octet-stream' },
        );
        fd.append('file', webFile);
      } else if (file instanceof File) {
        fd.append('file', file);
      } else {
        // Fallback: a plain {uri,name,type} object on web
        const res = await fetch((file as any).uri);
        const blob = await res.blob();
        const webFile = new File(
          [blob],
          (file as any).name || 'upload.jpg',
          { type: (file as any).type || blob.type || 'application/octet-stream' },
        );
        fd.append('file', webFile);
      }
    } else {
      // React-Native (iOS/Android)
      fd.append('file', {
        uri: (file as any).uri,                                 // content:// or file://
        name: (file as any).name || 'upload.jpg',
        type: (file as any).type || 'application/octet-stream',
      } as any);
    }
  }

  // Do NOT set Content-Type; axios will add multipart boundary
  return apiMethods.put<RestaurantData>(url, fd);
};
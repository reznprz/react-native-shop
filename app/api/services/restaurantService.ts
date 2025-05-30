import apiMethods from 'app/api/handlers/apiMethod';
import { ApiResponse } from 'app/api/handlers/index';
import { Platform } from 'react-native';

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
  file?: { uri: string; name: string; type: string } | File, // RN | Web
) => {
  const url = `/api/restaurants/${restaurantId}`;
  const fd = new FormData();

  /* Part “data”  */
  const json = JSON.stringify(updatedRestaurant);

  if (Platform.OS === 'web') {
    // Browser: a Blob automatically carries type=application/json
    fd.append('data', new Blob([json], { type: 'application/json' }));
  } else {
    // React-Native: add an object literal so the part has the right MIME type
    fd.append('data', {
      string: json, // RN key name is literally "string"
      name: 'data', // any filename; Spring ignores it
      type: 'application/json',
    } as any);
  }

  /*Part “file” (only if a new image was picked) */
  if (file) fd.append('file', file as any);

  return apiMethods.put<RestaurantData>(url, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }, // **keep it**
  });
};

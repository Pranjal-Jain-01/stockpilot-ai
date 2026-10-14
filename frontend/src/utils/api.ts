import type { InventoryItem, RiskAlert, Recommendation, DecisionRecord } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Inventory API functions
export async function fetchInventoryEnriched(): Promise<InventoryItem[]> {
  return fetchApi(`/inventory/enriched`);
}

// Risks API functions
export async function fetchRisks(): Promise<RiskAlert[]> {
  return fetchApi(`/risks`);
}

// Recommendations API functions
export async function fetchRecommendations(): Promise<Recommendation[]> {
  return fetchApi(`/recommendations`);
}

// History API functions
export async function fetchHistory(): Promise<DecisionRecord[]> {
  return fetchApi(`/history`);
}

// Recommendation approval API functions
export async function approveRecommendation(recommendationId: string, performedBy: string, notes?: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action_type: 'approved',
      performed_by: performedBy,
      notes: notes
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function rejectRecommendation(recommendationId: string, performedBy: string, notes?: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action_type: 'rejected',
      performed_by: performedBy,
      notes: notes
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
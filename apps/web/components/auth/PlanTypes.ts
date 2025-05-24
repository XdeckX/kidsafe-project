// Plan type definitions for the subscription system
export type PlanType = 'free-trial' | 'single' | 'family';

export interface PlanDetails {
  name: string;
  price: string;
  period: string;
  features: string[];
  color: string;
  requiresPayment: boolean;
}

export const planDetails: Record<PlanType, PlanDetails> = {
  'free-trial': {
    name: 'Free Trial',
    price: '$0',
    period: '7 days',
    features: ['1 child profile', 'Basic content filtering', 'Standard support'],
    color: 'from-green-500 to-emerald-600',
    requiresPayment: false
  },
  'single': {
    name: 'Single Child Plan',
    price: '$2.99',
    period: 'per month',
    features: ['1 child profile', 'Advanced content filtering', 'Email support'],
    color: 'from-purple-600 to-indigo-600',
    requiresPayment: true
  },
  'family': {
    name: 'Family Plan',
    price: '$9.99',
    period: 'per month',
    features: ['Up to 5 child profiles', 'Premium content filtering', 'Priority support'],
    color: 'from-blue-600 to-indigo-700',
    requiresPayment: true
  }
};

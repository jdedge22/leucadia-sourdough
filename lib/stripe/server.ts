import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

export const STRIPE_PRICE_ID_ONE_LOAF = process.env.STRIPE_PRICE_ID_ONE_LOAF!
export const STRIPE_PRICE_ID_TWO_LOAF = process.env.STRIPE_PRICE_ID_TWO_LOAF!

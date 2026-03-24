import { supabaseAdmin } from '../config/supabaseClient.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.id
    const { plan } = req.body

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: 'Plan must be monthly or yearly' })
    }

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_YEARLY_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
    })

    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}



export const handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeleted(deletedSubscription);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

const handleCheckoutSessionCompleted = async (session) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: subscription.metadata.userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        plan: subscription.items.data[0].price.nickname.toLowerCase().includes('yearly')
          ? 'yearly'
          : 'monthly',
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        charity_percentage: 10, // default
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving subscription:', error);
    } else {
      console.log('Subscription saved:', data);
    }
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  try {
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription:', error);
    } else {
      console.log('Subscription updated:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
};

const handleSubscriptionDeleted = async (subscription) => {
  try {
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'cancelled',
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error cancelling subscription:', error);
    } else {
      console.log('Subscription cancelled:', subscription.id);
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
};

export const getMySubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }

    if (!data) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    // Check if subscription is lapsed
    const now = new Date();
    const currentPeriodEnd = new Date(data.current_period_end);

    if (data.status === 'active' && now > currentPeriodEnd) {
      // Update status to lapsed if current period has ended
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'lapsed' })
        .eq('id', data.id);

      data.status = 'lapsed';
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};


export const mockSubscribe = async (req, res) => {
  try {
    const userId = req.user.id
    const { plan } = req.body

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ error: 'Plan must be monthly or yearly' })
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan: plan,
        status: 'active',
        stripe_subscription_id: 'mock_' + Date.now(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        charity_percentage: 10
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ message: 'Mock subscription activated', data })

  } catch (err) {
    return res.status(500).json({ error: 'Server error during mock subscribe' })
  }
}

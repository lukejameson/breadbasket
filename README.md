# BreadBasket 🍞

A simple, invite-only bakery ordering system for small-scale home baking operations. Built for friends and family to easily place orders for fresh baked goods.

## Features

- **Invite-only registration** - Keep it exclusive to your circle
- **Simple ordering system** - Browse menu and place orders easily
- **Manual payment flow** - Avoid payment processing fees with flexible payment options
- **Order management** - Track orders from placement to completion
- **Admin dashboard** - Manage orders, products, and users
- **Mobile-friendly** - Works great on phones and tablets

## Tech Stack

- **Frontend & Backend**: SvelteKit
- **Database**: SQLite
- **Deployment**: Docker
- **Styling**: TailwindCSS (optional)

## Usage

### For Customers

1. **Register**: Use an invite code to create your account
2. **Browse**: Check out available baked goods on the menu
3. **Order**: Add items to cart and place your order
4. **Pay**: Follow payment instructions (bank transfer, PayPal.me, or cash)
5. **Track**: Monitor your order status until ready for pickup

### For Baker (Admin)

1. **Manage Products**: Add/edit/remove items from the menu
2. **Process Orders**: Review new orders and confirm availability
3. **Track Payments**: Mark orders as paid when payment received
4. **Fulfill Orders**: Update status when items are ready
5. **Generate Invites**: Create invite codes for new customers

## Order Flow

- **Pending**: Order placed, awaiting your confirmation
- **Confirmed**: You've confirmed the order, customer needs to pay
- **Paid**: Payment received, ready to start baking
- **In Progress**: Currently being prepared
- **Ready**: Ready for pickup/delivery
- **Complete**: Order fulfilled

## Payment Options

Since this is designed for small-scale operations, payment processing fees are avoided by using:

- Bank transfers
- PayPal.me links
- Cash on collection
- Running tabs for regular customers

## Configuration

Key environment variables:

```env
DATABASE_PATH=./data/bakery.db
SESSION_SECRET=your-secret-key
ADMIN_EMAIL=your-email@example.com
SMTP_HOST=your-smtp-server
SMTP_USER=your-email
SMTP_PASS=your-password
```

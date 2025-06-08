/**
 * Email Service for Order Processing
 * Handles sending order confirmations to anas.py@outlook.com
 */

class EmailService {    constructor() {
        // EmailJS credentials
        this.serviceId = 'service_chpnwhh';
        this.templateId = 'template_xzd93ld'; // Use new template ID
        this.publicKey = 'xCK735NZsa3KxaTEf';
        this.adminEmail = 'anas.py@outlook.com';
        
        // Track initialization status
        this.isInitialized = false;
        this.initializePromise = this.initializeEmailJS();
    }

    async initializeEmailJS() {
        return new Promise((resolve, reject) => {
            const initCheck = () => {
                if (typeof emailjs !== 'undefined') {
                    try {
                        emailjs.init(this.publicKey);
                        console.log('✅ EmailJS initialized successfully');
                        this.isInitialized = true;
                        resolve();
                    } catch (error) {
                        console.error('❌ Failed to initialize EmailJS:', error);
                        reject(error);
                    }
                } else if (document.readyState !== 'complete') {
                    // Wait for page to load
                    window.addEventListener('load', initCheck);
                } else {
                    console.error('❌ EmailJS not found after page load');
                    reject(new Error('EmailJS library not found'));
                }
            };
            
            initCheck();
        });
    }

    /**
     * Send order notification email to admin
     */    async sendOrderNotification(orderData) {
        try {
            // Validate order data
            if (!orderData || !orderData.customer) {
                throw new Error('Invalid order data provided');
            }

            // Validate customer email
            if (!orderData.customer.email) {
                throw new Error('Customer email is required');
            }

            // Wait for EmailJS to initialize
            await this.initializePromise;
            
            if (!this.isInitialized) {
                throw new Error('EmailJS failed to initialize');
            }

            console.log('📧 Preparing to send order notification...');
            
            const emailContent = this.generateOrderEmailHtml(orderData);
            
            // Validate admin email
            if (!this.adminEmail) {
                throw new Error('Admin email configuration is missing');
            }              const templateParams = {
                email: this.adminEmail,
                order_id: orderData.orderId,
                customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
                customer_email: orderData.customer.email,
                customer_phone: orderData.customer.phone,
                shipping_address: `${orderData.shipping.address}, ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}, ${orderData.shipping.country}`,
                payment_method: this.formatPaymentMethod(orderData.payment.method),
                payment_amount: orderData.payment.amount.toFixed(2),
                items: JSON.stringify(orderData.items.map(item => ({
                    name: item.name,
                    units: item.quantity,
                                price: 'Contact for Quote',
            total: 'Contact for Quote'
                }))),
                shipping: orderData.summary.shipping.toFixed(2),
                tax: orderData.summary.tax.toFixed(2),
                total: orderData.summary.total.toFixed(2)
            };// Send email using EmailJS with retry logic
            let retries = 3;
            let lastError;
            
            while (retries > 0) {
                try {
                    const response = await emailjs.send(
                        this.serviceId,
                        this.templateId,
                        templateParams
                    );

                    console.log('✅ Order notification sent successfully');
                    return { success: true, message: 'Order notification sent' };
                } catch (error) {
                    lastError = error;
                    console.warn(`Attempt ${4 - retries}/3 failed:`, error.message);
                    retries--;
                    if (retries > 0) {
                        // Wait 1 second before retrying
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            console.error('❌ Failed to send order notification after 3 attempts:', lastError);
            throw new Error('Failed to send email after multiple attempts: ' + lastError.message);

        } catch (error) {
            console.error('❌ Failed to send order notification:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send order confirmation to customer
     */
    async sendCustomerConfirmation(orderData) {
        try {
            console.log('📧 Sending customer confirmation...');
            
            const confirmationData = {
                to_email: orderData.customer.email,
                subject: `Order Confirmation #${orderData.orderId} - Agarmay Fer`,
                customer_name: orderData.customer.firstName,
                order_id: orderData.orderId,
                order_total: `$${orderData.summary.total.toFixed(2)}`,
                estimated_delivery: this.calculateDeliveryDate(orderData.shipping.country),
                order_items: orderData.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                                price: 'Contact for Quote',
            total: 'Contact for Quote'
                }))
            };

            await this.simulateEmailSending(confirmationData, orderData, 'customer');
            
            console.log('✅ Customer confirmation sent successfully');
            return { success: true, message: 'Customer confirmation sent' };

        } catch (error) {
            console.error('❌ Failed to send customer confirmation:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate comprehensive order email HTML
     */
    generateOrderEmailHtml(orderData) {
        const items = orderData.items.map(item => `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; text-align: left;">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; margin-right: 12px; vertical-align: top;">
                    <strong>${item.name}</strong><br>
                    <small style="color: #6b7280;">${item.description || 'Steel product'}</small>
                </td>
                <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                                    <td style="padding: 12px; text-align: right;">Contact for Quote</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold;">Contact for Quote</td>
            </tr>
        `).join('');

        return `
            <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 2rem; text-align: center;">
                    <h1 style="margin: 0; font-size: 1.75rem; font-weight: 700;">New Order Received!</h1>
                    <p style="margin: 0.5rem 0 0; opacity: 0.9;">Order #${orderData.orderId}</p>
                </div>

                <!-- Customer Information -->
                <div style="padding: 2rem;">
                    <h2 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.25rem;">Customer Information</h2>
                    <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <strong>Name:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}<br>
                                <strong>Email:</strong> ${orderData.customer.email}<br>
                                <strong>Phone:</strong> ${orderData.customer.phone}
                                ${orderData.customer.company ? `<br><strong>Company:</strong> ${orderData.customer.company}` : ''}
                            </div>
                            <div>
                                <strong>Shipping Address:</strong><br>
                                ${orderData.shipping.address}<br>
                                ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}<br>
                                ${orderData.shipping.country}
                            </div>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <h2 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.25rem;">Order Items</h2>
                    <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; overflow: hidden; margin-bottom: 2rem;">
                        <thead>
                            <tr style="background: #e5e7eb;">
                                <th style="padding: 12px; text-align: left; font-weight: 600;">Product</th>
                                <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                                <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
                                <th style="padding: 12px; text-align: right; font-weight: 600;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items}
                        </tbody>
                    </table>

                    <!-- Order Summary -->
                    <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                        <h3 style="margin: 0 0 1rem; color: #1f2937;">Order Summary</h3>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Subtotal:</span>
                            <span>$${orderData.summary.subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Shipping:</span>
                            <span>${orderData.summary.shipping === 0 ? 'FREE' : '$' + orderData.summary.shipping.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Tax:</span>
                            <span>$${orderData.summary.tax.toFixed(2)}</span>
                        </div>
                        <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 1rem 0;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem;">
                            <span>Total:</span>
                            <span>$${orderData.summary.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <!-- Payment Method -->
                    <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                        <h3 style="margin: 0 0 0.5rem; color: #1f2937;">Payment Information</h3>
                        <p style="margin: 0;">
                            <strong>Method:</strong> ${this.formatPaymentMethod(orderData.payment.method)}<br>
                            <strong>Amount:</strong> $${orderData.payment.amount.toFixed(2)}
                        </p>
                    </div>

                    ${orderData.notes ? `
                    <!-- Order Notes -->
                    <div style="background: #fef3c7; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 2rem;">
                        <h3 style="margin: 0 0 0.5rem; color: #92400e;">Special Instructions</h3>
                        <p style="margin: 0; color: #92400e;">${orderData.notes}</p>
                    </div>
                    ` : ''}

                    <!-- Action Required -->
                    <div style="background: #dbeafe; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #3b82f6; text-align: center;">
                        <h3 style="margin: 0 0 0.5rem; color: #1e40af;">Action Required</h3>
                        <p style="margin: 0; color: #1e40af;">Please process this order and contact the customer for any clarifications.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #f9fafb; padding: 1.5rem; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">
                        Order placed on ${new Date(orderData.timestamp).toLocaleString()}<br>
                        Agarmay Fer - Premium Steel & Iron Products
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Format payment method for display
     */
    formatPaymentMethod(method) {
        const methods = {
            'cashOnDelivery': 'Cash on Delivery'
        };
        return methods[method] || 'Cash on Delivery';
    }

    /**
     * Calculate estimated delivery date
     */
    calculateDeliveryDate(country) {
        const days = country === 'MA' ? 3 : 7; // Morocco gets faster delivery
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + days);
        return deliveryDate.toLocaleDateString();
    }

    /**
     * Simulate email sending (replace with real email service)
     */
    async simulateEmailSending(emailData, orderData, type = 'admin') {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // Log the email content for demonstration
                    console.log('📧 Email Details:');
                    console.log('To:', type === 'admin' ? this.adminEmail : orderData.customer.email);
                    console.log('Subject:', emailData.subject || `Order #${orderData.orderId}`);
                    console.log('Order Data:', orderData);
                    
                    // Store in localStorage for demonstration
                    const emails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
                    emails.push({
                        id: Date.now(),
                        to: type === 'admin' ? this.adminEmail : orderData.customer.email,
                        subject: emailData.subject || `Order #${orderData.orderId}`,
                        content: this.generateOrderEmailHtml(orderData),
                        timestamp: new Date().toISOString(),
                        type: type,
                        orderData: orderData
                    });
                    localStorage.setItem('sent_emails', JSON.stringify(emails));
                    
                    resolve({ success: true });
                } catch (error) {
                    reject(error);
                }
            }, 1000 + Math.random() * 1000); // 1-2 second delay
        });
    }

    /**
     * Get all sent emails (for demonstration)
     */
    getSentEmails() {
        return JSON.parse(localStorage.getItem('sent_emails') || '[]');
    }

    /**
     * Clear sent emails (for demonstration)
     */
    clearSentEmails() {
        localStorage.removeItem('sent_emails');
    }
}

// Initialize email service
window.EmailService = new EmailService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}

console.log('📧 Email Service initialized - Ready to send orders to anas.py@outlook.com');
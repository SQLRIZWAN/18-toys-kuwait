// WhatsApp JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const whatsappNumber = '96594091673';

    window.whatsapp = {
        sendMessage: function(message) {
            const encodedMessage = encodeURIComponent(message);
            const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            window.open(url, '_blank');
        },

        sendOrderConfirmation: function(orderData) {
            let message = `🛒 *New Order*\n\n`;
            message += `📦 Order ID: ${orderData.id}\n`;
            message += `👤 Name: ${orderData.customer.name}\n`;
            message += `📱 Phone: +965 ${orderData.customer.phone}\n`;

            if (orderData.customer.email) {
                message += `📧 Email: ${orderData.customer.email}\n`;
            }

            message += `\n📍 *Delivery Address:*\n${orderData.address.full}\n`;

            if (orderData.address.area) {
                message += `Area: ${orderData.address.area}\n`;
            }

            if (orderData.address.block) {
                message += `Block: ${orderData.address.block}\n`;
            }

            if (orderData.address.coordinates) {
                message += `\n🗺️ Location: https://www.openstreetmap.org/?mlat=${orderData.address.coordinates.lat}&mlon=${orderData.address.coordinates.lng}\n`;
            }

            message += `\n💳 *Payment:*\n`;
            message += `Method: WAMD\n`;
            message += `Transaction ID: ${orderData.payment.transactionId}\n`;
            message += `Amount: ${orderData.total.toFixed(3)} KD\n`;

            message += `\n📦 *Items:*\n`;
            orderData.items.forEach(item => {
                message += `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(3)} KD\n`;
            });

            message += `\n💰 *Total: ${orderData.total.toFixed(3)} KD*\n`;

            this.sendMessage(message);
        },

        sendQuickMessage: function(productName) {
            const message = `Hi, I'm interested in ${productName}. Is it available?`;
            this.sendMessage(message);
        }
    };

    // Setup WhatsApp buttons
    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.dataset.whatsapp;
            window.whatsapp.sendMessage(message);
        });
    });
});

const express = require('express');
const router = require('./src/modules/ivr/ivr.routes');

console.log('Router IVR:', typeof router);
console.log('Es función?:', typeof router === 'function');
console.log('Stack:', router?.stack?.length || 'N/A');

if (router && router.stack) {
    console.log('\nRutas registradas:');
    router.stack.forEach((layer, index) => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            console.log(`${index + 1}. ${methods} ${layer.route.path}`);
        }
    });
}

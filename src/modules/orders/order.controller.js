const { placeOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus } = require('./order.service');

async function placeOrderHandler(req, reply) {
    try{
        const order = await placeOrder(req.user.id, req.body);
        return reply.status(201).send(order);
    }catch(error){
        reply.code(500).send({ error: error.message });
    }
}

async function getOrdersHandler(req, reply) {
    try{
        const orders = await getOrders(req.user.id);
        return reply.send(orders);
    }catch(error){
        reply.code(500).send({ error: error.message });
    }
}

async function getOrderByIdHandler(req, reply) {
    try{
        const order = await getOrderById(req.params.id, req.user.id);
        return reply.send(order);
    }catch(error){
        reply.code(500).send({ error: error.message });
    }
}

async function getAllOrdersHandler(req, reply) {
    try{
        const orders = await getAllOrders();
        return reply.send(orders);
    }catch(error){
        reply.code(500).send({ error: error.message });
    }
}


async function updateOrderStatusHandler(req, reply) {
    try{
        const order = await updateOrderStatus(req.params.id, req.body.status);
        return reply.send(order);
    }catch(error){
        reply.code(500).send({ error: error.message });
    }
}

module.exports = {
    placeOrder: placeOrderHandler,
    getOrders: getOrdersHandler,
    getOrderById: getOrderByIdHandler,
    getAllOrders: getAllOrdersHandler,
    updateOrderStatus: updateOrderStatusHandler
};
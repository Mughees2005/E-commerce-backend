const { getAllDeliveryAreas, addDeliveryArea, updateDeliveryArea, deleteDeliveryArea } = require('./delivery-areas.service');

async function getAllDeliveryAreasHandler(req, reply) {
    try {
        const areas = await getAllDeliveryAreas();
        return reply.send(areas);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function addDeliveryAreaHandler(req, reply) {
    try {
        const area = await addDeliveryArea(req.body);
        return reply.status(201).send(area);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function updateDeliveryAreaHandler(req, reply) {
    try {
        const area = await updateDeliveryArea(req.params.id, req.body);
        return reply.send(area);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}

async function deleteDeliveryAreaHandler(req, reply) {
    try {
        const result = await deleteDeliveryArea(req.params.id);
        return reply.send(result);
    } catch (error) {
        reply.code(500).send({ error: error.message });
    }
}


module.exports = { 
    getAllDeliveryAreas: getAllDeliveryAreasHandler,
    addDeliveryArea: addDeliveryAreaHandler,
    updateDeliveryArea: updateDeliveryAreaHandler,
    deleteDeliveryArea: deleteDeliveryAreaHandler
};
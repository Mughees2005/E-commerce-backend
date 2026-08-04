const { DeliveryArea } = require('../../database/models/index');

// Get all active delivery areas
async function getAllDeliveryAreas() {
    const areas = await DeliveryArea.findAll({
        where: { is_active: true },
        attributes: ['id', 'area_name', 'delivery_charge'],
        order: [['delivery_charge', 'ASC'], ['area_name', 'ASC']]
    });
    return areas;
}

// Add new delivery area (admin)
async function addDeliveryArea(areaData) {
    const { area_name, delivery_charge } = areaData;
    const area = await DeliveryArea.create({ area_name, delivery_charge });
    return area;
}

// Update delivery area (admin)
async function updateDeliveryArea(id, updateData) {
    const area = await DeliveryArea.findByPk(id);
    if (!area) throw new Error('Delivery area not found');
    await area.update(updateData);
    return area;
}

// Delete delivery area (admin)
async function deleteDeliveryArea(id) {
    const area = await DeliveryArea.findByPk(id);
    if (!area) throw new Error('Delivery area not found');
    await area.update({ is_active: false });
    return { message: 'Delivery area deleted successfully' };
}

module.exports = { getAllDeliveryAreas, addDeliveryArea, updateDeliveryArea, deleteDeliveryArea };
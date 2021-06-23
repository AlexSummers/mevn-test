const mongoose = require('mongoose');
const ClientModel = require('../model/ClientModel');

class ClientRepository {
  constructor(model) {
    this.model = model;
  }

  create(name, email, phone, providerIds = []) {
    const modelData = {
      name, email, phone, providerIds: providerIds.map((providerId) => new mongoose.Types.ObjectId(providerId)),
    };
    const model = new this.model(modelData);
    return model.save();
  }

  findAll(filter = {}) {
    return this.model.find(filter);
  }

  /**
   * @param {string} id
   */
  findById(id) {
    return this.model.findById(id);
  }

  /**
   * @param {string} id
   */
  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  updateById(id, name, email, phone, providerIds) {
    return this.model.findOneAndUpdate({ _id: id }, {
      name,
      email,
      phone,
      providerIds: providerIds.map((providerId) => new mongoose.Types.ObjectId(providerId)),
    }, { new: true });
  }

  async deleteProviderIdFromAll(providerId) {
    const providerObjectId = new mongoose.Types.ObjectId(providerId);
    const clients = await this.findAll({ providerIds: providerObjectId });
    const updatedProviderIdsByClientId = {};
    clients.forEach((client) => {
      const providerIndex = client.providerIds.indexOf(providerId);
      if (providerIndex === -1) {
        return;
      }
      client.providerIds.splice(providerIndex, 1);
      updatedProviderIdsByClientId[client._id] = client.providerIds;
    });
    if (Object.keys(updatedProviderIdsByClientId).length === 0) {
      return;
    }

    const bulk = this.model.collection.initializeOrderedBulkOp();
    Object.keys(updatedProviderIdsByClientId).forEach((clientId) => {
      bulk
        .find({ _id: new mongoose.Types.ObjectId(clientId) })
        .updateOne({
          $set: { providerIds: updatedProviderIdsByClientId[clientId] },
        });
    });
    bulk.execute((error) => {
      if (error !== null) {
        console.error(error);
      }
    });
  }
}

module.exports = new ClientRepository(ClientModel);
